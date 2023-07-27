import json
from datetime import datetime, timezone
from typing import List
from uuid import UUID

import pytest
from gql import gql
from gql.client import AsyncClientSession
from pydantic import BaseModel

from cdb.api.db.crud.account import POLE_EMPLOI_SERVICE_ACCOUNT_ID
from cdb.api.db.models.notebook import Notebook
from cdb.api.db.models.ref_situation import RefSituation
from cdb.api.domain.contraintes import (
    FocusDifferences,
    FocusToAdd,
    TargetDifferences,
    TargetPayload,
    TargetToAdd,
)
from cdb.api.domain.situations import SituationDifferences, SituationToAdd
from cdb.api.v1.routers.pe_diagnostic.pe_diagnostic_io import save_differences
from cdb.cdb_csv.json_encoder import CustomEncoder


class FakeSituation(BaseModel):
    id: UUID
    notebookId: UUID
    situationId: UUID
    createdAt: datetime


class FakeTarget(BaseModel):
    id: UUID
    target: str
    creatorId: UUID


class FakeTargetData(BaseModel):
    data: List[FakeTarget]


class FakeFocus(BaseModel):
    id: UUID | None = None
    theme: str
    notebookId: UUID
    createdAt: None | datetime = None
    targets: FakeTargetData | None = None
    creatorId: UUID

    def jsonb(self) -> dict:
        return json.loads(json.dumps(self.dict(exclude_none=True), cls=CustomEncoder))


@pytest.mark.graphql
async def test_save_differences(
    gql_admin_client: AsyncClientSession,
    notebook_craig_reilly: Notebook,
    ref_situation_aucun_moyen_transport: RefSituation,
    ref_situation_dependant_des_transports: RefSituation,
):
    await given_focuses_and_situations_in_notebook(
        client=gql_admin_client,
        situations=[
            FakeSituation(
                id=UUID("42cfb92a-adf5-4ee9-abe8-fba1eb5b4f0b"),
                notebookId=notebook_craig_reilly.id,
                situationId=ref_situation_aucun_moyen_transport.id,
                createdAt=datetime.now(tz=timezone.utc),
            ),
        ],
        focuses=[
            FakeFocus(
                id=UUID("af13bb83-e09d-42d6-b683-38e690e78bde"),
                theme="mobilite",
                notebookId=notebook_craig_reilly.id,
                createdAt=datetime.now(tz=timezone.utc),
                targets=FakeTargetData(
                    data=[
                        FakeTarget(
                            id=UUID("a37221df-fd67-4505-b847-d869c75656bc"),
                            target="Dépendant des transports en commun",
                            creatorId=POLE_EMPLOI_SERVICE_ACCOUNT_ID,
                        ),
                        FakeTarget(
                            id=UUID("d2abc3b0-339d-4f6e-a02e-6b389226ead5"),
                            target="Permis et/ou code en cours",
                            creatorId=POLE_EMPLOI_SERVICE_ACCOUNT_ID,
                        ),
                    ]
                ),
                creatorId=POLE_EMPLOI_SERVICE_ACCOUNT_ID,
            ),
            FakeFocus(
                id=UUID("156faab6-4ffd-49ad-b935-538184b02755"),
                theme="numerique",
                notebookId=notebook_craig_reilly.id,
                createdAt=datetime.now(tz=timezone.utc),
                creatorId=POLE_EMPLOI_SERVICE_ACCOUNT_ID,
            ),
        ],
    )

    await save_differences(
        session=gql_admin_client,
        notebook_id=notebook_craig_reilly.id,
        differences=SituationDifferences(
            situations_to_add=[
                SituationToAdd(
                    ref_situation_dependant_des_transports.id, datetime(2022, 2, 2)
                )
            ],
            situations_to_delete=[UUID("42cfb92a-adf5-4ee9-abe8-fba1eb5b4f0b")],
        ),
        focus_differences=FocusDifferences(
            focuses_to_add=[
                FocusToAdd(
                    theme="logement",
                    created_at=datetime(2022, 1, 1),
                    targets=[TargetPayload("Changer de logement")],
                    creator_id=POLE_EMPLOI_SERVICE_ACCOUNT_ID,
                )
            ],
            focus_ids_to_delete=[UUID("156faab6-4ffd-49ad-b935-538184b02755")],
            target_differences=TargetDifferences(
                targets_to_add=[
                    TargetToAdd(
                        focusId=UUID("af13bb83-e09d-42d6-b683-38e690e78bde"),
                        target="Permis B",
                        creatorId=POLE_EMPLOI_SERVICE_ACCOUNT_ID,
                    )
                ],
                target_ids_to_cancel=[UUID("a37221df-fd67-4505-b847-d869c75656bc")],
                target_ids_to_end=[UUID("d2abc3b0-339d-4f6e-a02e-6b389226ead5")],
            ),
        ),
    )
    result = await get_situation_and_focuses_for_notebook(
        client=gql_admin_client, notebook_id=notebook_craig_reilly.id
    )
    assert result
    [deleted_situation] = [
        situation
        for situation in result["situations"]
        if situation["refSituation"]["description"]
        == ref_situation_aucun_moyen_transport.description
    ]
    assert ref_situation_dependant_des_transports.description in [
        situation["refSituation"]["description"] for situation in result["situations"]
    ]
    assert deleted_situation["deletedAt"]

    [focus_logement] = [
        focus for focus in result["focuses"] if focus["theme"] == "logement"
    ]
    assert focus_logement
    assert (
        focus_logement["createdAt"]
        == datetime(2022, 1, 1, tzinfo=timezone.utc).isoformat()
    )
    assert "numerique" not in [focus["theme"] for focus in result["focuses"]]

    [focus_mobilite] = [
        focus for focus in result["focuses"] if focus["theme"] == "mobilite"
    ]
    assert focus_mobilite
    [target_permis_b] = [
        target for target in focus_mobilite["targets"] if target["target"] == "Permis B"
    ]
    assert target_permis_b
    assert target_permis_b["status"] == "in_progress"
    [target_dependant_des_transport] = [
        target
        for target in focus_mobilite["targets"]
        if target["target"] == "Dépendant des transports en commun"
    ]
    assert target_dependant_des_transport["status"] == "abandonned"
    [target_dependant_des_transport] = [
        target
        for target in focus_mobilite["targets"]
        if target["target"] == "Permis et/ou code en cours"
    ]
    assert target_dependant_des_transport["status"] == "done"


async def given_focuses_and_situations_in_notebook(
    client: AsyncClientSession,
    situations: List[FakeSituation],
    focuses: List[FakeFocus],
):
    await client.execute(
        gql(
            """
        mutation(
            $situations: [notebook_situation_insert_input!]!,
            $focuses: [notebook_focus_insert_input!]!
        ){
            insert_notebook_situation(objects: $situations) { affected_rows }
            insert_notebook_focus(objects: $focuses) { affected_rows }
        }
        """
        ),
        variable_values={
            "situations": [json.loads(situation.json()) for situation in situations],
            "focuses": [focus.jsonb() for focus in focuses],
        },
    )


async def get_situation_and_focuses_for_notebook(
    client: AsyncClientSession, notebook_id: UUID
):
    result = await client.execute(
        gql(
            """
       query ($notebook_id: uuid!) {
        notebook_by_pk(id: $notebook_id) {
            situations {
            deletedAt
            refSituation {
                description
            }
            }
            focuses {
                theme
                createdAt
                targets {
                    createdAt
                    target
                    status
                }
            }
        }
        }
        """
        ),
        variable_values={"notebook_id": notebook_id},
    )
    return result["notebook_by_pk"] if result.get("notebook_by_pk") else None
