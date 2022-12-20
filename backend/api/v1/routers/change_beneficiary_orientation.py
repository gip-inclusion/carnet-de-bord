import logging
import os
from datetime import datetime
from uuid import UUID

from fastapi import APIRouter, BackgroundTasks, Depends, Header
from fastapi.exceptions import HTTPException
from gql import Client, gql
from gql.dsl import DSLMutation, DSLSchema, dsl_gql
from gql.transport.aiohttp import AIOHTTPTransport
from pydantic import BaseModel

from api.core.emails import (
    Member,
    Person,
    send_deny_orientation_request_email,
    send_notebook_member_email,
)
from api.core.settings import gqlSchema, settings
from api.db.models.orientation_type import OrientationType
from api.db.models.role import RoleEnum
from api.v1.dependencies import allowed_jwt_roles

orientation_manager_only = allowed_jwt_roles([RoleEnum.ORIENTATION_MANAGER])
router = APIRouter(dependencies=[Depends(orientation_manager_only)])


logger = logging.getLogger(__name__)


class ChangeBeneficiaryOrientationInput(BaseModel):
    beneficiary_id: UUID
    notebook_id: UUID
    orientation_type: OrientationType
    structure_id: UUID
    orientation_request_id: UUID | None
    new_referent_account_id: UUID | None

    def gql_variables_for_query(self) -> dict[str, str | bool]:

        return {
            "notebook_id": str(self.notebook_id),
            "structure_id": str(self.structure_id),
            "new_referent_account_id": str(self.new_referent_account_id),
            "with_new_referent": self.new_referent_account_id is not None,
        }


@router.post("/change-beneficiary-orientation")
async def change_beneficiary_orientation(
    data: ChangeBeneficiaryOrientationInput,
    background_tasks: BackgroundTasks,
    jwt_token: str | None = Header(default=None),
):
    """
    Change beneficiary orientation allows an orientation manager
    to update the current orientation, structure attachement and referent
    based on an orientation request (or not)
    An orientation is represented by several tables
    - notebook_info holds the current orientation value,
    - orientation_request holds orientation_request infos
    - beneficiary_structure holds the relation between a structure and a beneficiary
    - notebook_member holds the relation of an account (pro, orientation_manager) with a notebook

    change_beneficiary_oriention will first close the orientation request (save the decision, date, choosed orientation)
    then it will deactivate the current beneficiary_structure and add the new beneficiary_structure if the structure has changed
    then it will deactivate the currents notebook_member records (referent / no_referen)
    then it will add the new notebook_member records (referent / no-referent)

    """
    if not jwt_token:
        raise HTTPException(status_code=401, detail="unauthorized")

    transport = AIOHTTPTransport(
        url=settings.graphql_api_url, headers={"Authorization": "Bearer " + jwt_token}
    )

    async with Client(
        transport=transport, fetch_schema_from_transport=False, serialize_variables=True
    ) as session:

        orientation_info_response = await session.execute(
            gql(load_gql_file("orientation_info.gql")),
            variable_values=data.gql_variables_for_query(),
        )

        if orientation_info_response is None:
            raise HTTPException(
                status_code=500,
                detail=f"Error while reading getOrientationInfo.gql mutation file",
            )

        schema = gqlSchema.get_schema()
        if not schema:
            raise HTTPException(
                status_code=500,
                detail=f"No graphql schema found",
            )
        ds = DSLSchema(schema)
        mutations = {}

        if data.orientation_request_id:
            beneficiary = orientation_info_response["notebook_by_pk"]["beneficiary"]

            try:
                raise_if_orientation_request_not_match_beneficiary(
                    str(data.orientation_request_id),
                    str(beneficiary["orientation_request"][0]["id"])
                    if len(beneficiary["orientation_request"]) > 0
                    else "",
                )
            except Exception as exception:
                logging.error(
                    "%s does not match beneficiary_id %s",
                    data.orientation_request_id,
                    data.beneficiary_id,
                )
                raise HTTPException(
                    status_code=403,
                    detail="orientation_request_id and beneficiary don't match",
                ) from exception

            mutations = mutations | {
                "accept_orientation_request": ds.mutation_root.update_orientation_request_by_pk.args(
                    pk_columns={"id": str(data.orientation_request_id)},
                    _set={
                        "decidedAt": "now",
                        "status": "accepted",
                        "decidedOrientationTypeId": data.orientation_type,
                    },
                ).select(
                    ds.orientation_request.id,
                    ds.orientation_request.createdAt,
                ),
            }

        former_referent_account_id = None
        if orientation_info_response["notebook_by_pk"]["former_referents"]:
            former_referent_account_id = orientation_info_response["notebook_by_pk"][
                "former_referents"
            ][0]["account"]["id"]
        former_structure_id = None
        if orientation_info_response["notebook_by_pk"]["beneficiary"]["structures"]:
            former_structure_id = orientation_info_response["notebook_by_pk"][
                "beneficiary"
            ]["structures"][0]["structureId"]

        # human readable boolean
        has_new_referent = data.new_referent_account_id is not None
        has_old_referent = former_referent_account_id is not None
        are_old_new_referents_different = str(data.new_referent_account_id) != str(
            former_referent_account_id
        )
        need_deactivation = (has_new_referent and are_old_new_referents_different) or (
            has_old_referent and not has_new_referent
        )
        structure_changed = str(data.structure_id) != str(former_structure_id)

        mutations = mutations | {
            "add_notebook_info": ds.mutation_root.insert_notebook_info_one.args(
                object={
                    "notebookId": str(data.notebook_id),
                    "orientation": data.orientation_type,
                    "needOrientation": False,
                },
                on_conflict={
                    "constraint": "notebook_info_pkey",
                    "update_columns": ["orientation", "needOrientation"],
                },
            ).select(ds.notebook_info.notebookId)
        }
        if structure_changed:
            mutations = mutations | {
                "deactivate_old_structure": ds.mutation_root.update_beneficiary_structure.args(
                    where={
                        "beneficiaryId": {"_eq": str(data.beneficiary_id)},
                        "status": {"_eq": "current"},
                    },
                    _set={"status": "outdated"},
                ).select(
                    ds.beneficiary_structure_mutation_response.affected_rows
                ),
                "add_new_structure": ds.mutation_root.insert_beneficiary_structure_one.args(
                    object={
                        "beneficiaryId": str(data.beneficiary_id),
                        "structureId": str(data.structure_id),
                        "status": "current",
                    },
                ).select(
                    ds.beneficiary_structure.id
                ),
            }
        if need_deactivation:
            deactivation_clause = [
                {
                    "notebookId": {"_eq": str(data.notebook_id)},
                    "memberType": {"_eq": "referent"},
                    "active": {"_eq": True},
                }
            ]
            if data.new_referent_account_id:
                deactivation_clause.append(
                    {
                        "notebookId": {"_eq": str(data.notebook_id)},
                        "accountId": {"_eq": str(data.new_referent_account_id)},
                        "active": {"_eq": True},
                    }
                )

            mutations = mutations | {
                "deactivate_changed_member_rows": ds.mutation_root.update_notebook_member.args(
                    where={"_or": deactivation_clause},
                    _set={
                        "active": False,
                        "membershipEndedAt": datetime.now().isoformat(),
                    },
                ).select(
                    ds.notebook_member_mutation_response.affected_rows
                )
            }
            if has_old_referent:
                mutations = mutations | {
                    "create_former_referent_row": ds.mutation_root.insert_notebook_member_one.args(
                        object={
                            "notebookId": str(data.notebook_id),
                            "accountId": str(former_referent_account_id),
                            "memberType": "no_referent",
                        },
                    ).select(
                        ds.notebook_member.id
                    )
                }
            if has_new_referent:
                mutations = mutations | {
                    "create_new_referent_row": ds.mutation_root.insert_notebook_member_one.args(
                        object={
                            "notebookId": str(data.notebook_id),
                            "accountId": str(data.new_referent_account_id),
                            "memberType": "referent",
                        },
                    ).select(
                        ds.notebook_member.id
                    )
                }

        response = await session.execute(dsl_gql(DSLMutation(**mutations)))

        former_referent_account_id = None
        if orientation_info_response["notebook_by_pk"]["former_referents"]:
            former_referent_account_id = orientation_info_response["notebook_by_pk"][
                "former_referents"
            ][0]["account"]["id"]
        former_referents = [
            Member.parse_from_gql(member["account"]["professional"])
            for member in orientation_info_response["notebook_by_pk"][
                "former_referents"
            ]
        ]
        beneficiary = Person.parse_from_gql(
            orientation_info_response["notebook_by_pk"]["beneficiary"]
        )
        new_structure = orientation_info_response["newStructure"]["name"]
        for referent in former_referents:
            background_tasks.add_task(
                send_notebook_member_email,
                to_email=referent.email,
                beneficiary=beneficiary,
                orientation=data.orientation_type,
                former_referents=former_referents,
                new_structure=new_structure,
                new_referent=Member.parse_from_gql(
                    orientation_info_response["newReferent"][0]
                )
                if "newReferent" in orientation_info_response
                and len(orientation_info_response["newReferent"]) > 0
                else None,
            )

        if "newReferent" in orientation_info_response:
            for new_referent in orientation_info_response["newReferent"]:
                new_referent = Member.parse_from_gql(new_referent)

                background_tasks.add_task(
                    send_notebook_member_email,
                    to_email=new_referent.email,
                    new_referent=new_referent,
                    beneficiary=beneficiary,
                    former_referents=former_referents,
                    orientation=data.orientation_type,
                    new_structure=new_structure,
                )

        return response


class DenyBeneficiaryOrientationInput(BaseModel):
    orientation_request_id: UUID

    def gql_variables(self):
        return {"id": str(self.orientation_request_id)}


@router.post("/deny-orientation-request")
async def deny_orientation_request(
    data: DenyBeneficiaryOrientationInput,
    background_tasks: BackgroundTasks,
    jwt_token: str | None = Header(default=None),
):
    if not jwt_token:
        raise HTTPException(status_code=401, detail="unauthorized")

    transport = AIOHTTPTransport(
        url=settings.graphql_api_url, headers={"Authorization": "Bearer " + jwt_token}
    )

    async with Client(
        transport=transport, fetch_schema_from_transport=False, serialize_variables=True
    ) as session:

        deny_response = await session.execute(
            gql(load_gql_file("_denyOrientationRequestById.gql")),
            variable_values=data.gql_variables(),
        )
        if deny_response is None:
            raise HTTPException(
                status_code=500,
                detail=f"Error while reading _denyOrientationRequestById.gql mutation file",
            )
        beneficiary = Person.parse_from_gql(
            deny_response["orientation_request"]["beneficiary"]
        )
        background_tasks.add_task(
            send_deny_orientation_request_email,
            to_email=deny_response["orientation_request"]["requestor"]["professional"][
                "email"
            ],
            beneficiary=beneficiary,
        )


def load_gql_file(filename: str, path: str = os.path.dirname(__file__)):
    with open(os.path.join(path, filename), encoding="utf-8") as f:
        return f.read()


def raise_if_orientation_request_not_match_beneficiary(
    orientation_request_id: str, beneficiary_request_id: str
) -> None:

    if orientation_request_id != beneficiary_request_id:
        raise Exception(
            f"orientation_request_id {orientation_request_id} does not match beneficiary_request_id {beneficiary_request_id}"
        )
