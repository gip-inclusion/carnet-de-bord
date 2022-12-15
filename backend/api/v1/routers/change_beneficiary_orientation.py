import json
import logging
import os
from datetime import datetime
from uuid import UUID

from fastapi import APIRouter, BackgroundTasks, Depends, Header
from fastapi.exceptions import HTTPException
from gql import Client, gql
from gql.dsl import DSLMutation, DSLSchema, DSLVariable, dsl_gql
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

    def gql_variables_for_mutation(
        self, old_referent_account_id: UUID | None
    ) -> dict[str, str | bool]:
        variables = (
            {"orientation_request_id": str(self.orientation_request_id)}
            if self.orientation_request_id
            else {}
        )

        has_new_referent = self.new_referent_account_id is not None
        has_old_referent = old_referent_account_id is not None
        are_old_new_referents_different = str(self.new_referent_account_id) != str(
            old_referent_account_id
        )
        if self.new_referent_account_id:
            variables = variables | {
                "new_referent_account_id": str(self.new_referent_account_id)
            }
        if old_referent_account_id:
            variables = variables | {
                "old_referent_account_id": str(old_referent_account_id)
            }
        return variables | {
            "orientation_type": str(self.orientation_type),
            "notebook_id": str(self.notebook_id),
            "beneficiary_id": str(self.beneficiary_id),
            "structure_id": str(self.structure_id),
            "with_old_referent": has_old_referent and are_old_new_referents_different,
            "with_new_referent": has_new_referent and are_old_new_referents_different,
            "date": datetime.now().isoformat(),
            "with_deactivation": (has_new_referent and are_old_new_referents_different)
            or (has_old_referent and not has_new_referent),
        }

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
    if not jwt_token:
        raise HTTPException(status_code=401, detail="unauthorized")

    transport = AIOHTTPTransport(
        url=settings.graphql_api_url, headers={"Authorization": "Bearer " + jwt_token}
    )

    async with Client(
        transport=transport, fetch_schema_from_transport=False, serialize_variables=True
    ) as session:

        notification_response = await session.execute(
            gql(load_gql_file("notificationInfo.gql")),
            variable_values=data.gql_variables_for_query(),
        )

        if notification_response is None:
            raise HTTPException(
                status_code=500,
                detail=f"Error while reading notificationInfo.gql mutation file",
            )

        if data.orientation_request_id:
            beneficiary = notification_response["notebook_by_pk"]["beneficiary"]

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

        former_referent_account_id = None
        if notification_response["notebook_by_pk"]["former_referents"]:
            former_referent_account_id = notification_response["notebook_by_pk"][
                "former_referents"
            ][0]["account"]["id"]
        former_structure_id = None
        if notification_response["notebook_by_pk"]["beneficiary"]["structures"]:
            former_structure_id = notification_response["notebook_by_pk"][
                "beneficiary"
            ]["structures"][0]["structureId"]

        has_new_referent = str(data.new_referent_account_id) is not None
        has_old_referent = str(former_referent_account_id) is not None
        are_old_new_referents_different = str(data.new_referent_account_id) != str(
            former_referent_account_id
        )
        need_deactivation = (has_new_referent and are_old_new_referents_different) or (
            has_old_referent and not has_new_referent
        )
        structure_changed = str(data.structure_id) != str(former_structure_id)

        schema = gqlSchema.get_schema()
        ds = DSLSchema(schema)
        mutations = {
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
            mutations = mutations | {
                "deactivate_changed_member_rows": ds.mutation_root.update_notebook_member.args(
                    where={
                        "_or": [
                            {
                                "notebookId": {"_eq": str(data.notebook_id)},
                                "memberType": {"_eq": "referent"},
                                "active": {"_eq": True},
                            },
                            {
                                "notebookId": {"_eq": str(data.notebook_id)},
                                "accountId": {"_eq": str(data.new_referent_account_id)},
                                "active": {"_eq": True},
                            }
                            if data.new_referent_account_id
                            else {},
                        ]
                    },
                    _set={
                        "active": False,
                        "membership_ends_at": datetime.now().isoformat(),
                    },
                ).select(
                    ds.notebook_member_mutation_response.affected_rows
                )
            }
        all_mutations = dsl_gql(DSLMutation(**mutations))
        result = await session.execute(all_mutations)
        print(result)
        return result

        mutation_filename = (
            "_changeBeneficiaryOrientation.gql"
            if data.orientation_request_id is None
            else "_acceptOrientationRequest.gql"
        )

        print(mutation_filename)
        mutation = load_gql_file(mutation_filename)

        notification_response = await session.execute(
            gql(load_gql_file("notificationInfo.gql")),
            variable_values=data.gql_variables_for_query(),
        )

        if notification_response is None:
            raise HTTPException(
                status_code=500,
                detail=f"Error while reading notificationInfo.gql mutation file",
            )

        if data.orientation_request_id:
            beneficiary = notification_response["notebook_by_pk"]["beneficiary"]

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

        former_referent_account_id = None
        if notification_response["notebook_by_pk"]["former_referents"]:
            former_referent_account_id = notification_response["notebook_by_pk"][
                "former_referents"
            ][0]["account"]["id"]

        print(data.gql_variables_for_mutation(former_referent_account_id))
        response = await session.execute(
            gql(mutation),
            variable_values=data.gql_variables_for_mutation(former_referent_account_id),
        )
        former_referents = [
            Member.parse_from_gql(member["account"]["professional"])
            for member in notification_response["notebook_by_pk"]["former_referents"]
        ]
        beneficiary = Person.parse_from_gql(
            notification_response["notebook_by_pk"]["beneficiary"]
        )
        new_structure = notification_response["newStructure"]["name"]
        for referent in former_referents:
            background_tasks.add_task(
                send_notebook_member_email,
                to_email=referent.email,
                beneficiary=beneficiary,
                orientation=data.orientation_type,
                former_referents=former_referents,
                new_structure=new_structure,
                new_referent=Member.parse_from_gql(
                    notification_response["newReferent"][0]
                )
                if "newReferent" in notification_response
                and len(notification_response["newReferent"]) > 0
                else None,
            )

        if "newReferent" in notification_response:
            for new_referent in notification_response["newReferent"]:
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
