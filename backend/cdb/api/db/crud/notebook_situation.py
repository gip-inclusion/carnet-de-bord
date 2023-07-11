from typing import List
from uuid import UUID

from gql import gql
from gql.client import AsyncClientSession

from cdb.api.db.models.ref_situation import RefSituation
from cdb.api.v1.payloads.socio_pro import SituationInsertInput


async def get_ref_situations(client: AsyncClientSession) -> List[RefSituation]:
    query = gql(
        (
            """
        query {
            ref_situation {
                id, description, theme
            }
        }
    """
        )
    )
    response = await client.execute(query)
    ref_situations = response.get("ref_situation")
    ref_situations_parsed = []
    if ref_situations:
        ref_situations_parsed = [
            RefSituation.parse_obj(situation) for situation in ref_situations
        ]

    return ref_situations_parsed


async def save_notebook_situations(
    client: AsyncClientSession,
    notebookId: UUID,
    situations_to_add: List[SituationInsertInput],
    situation_ids_to_delete: List[UUID],
):
    mutation = gql(
        """
        mutation saveSituations(
            $notebookId: uuid!,
            $situationsToAdd: [notebook_situation_insert_input!]!,
            $situationIdsToDelete: [uuid!]!
        ) {
            update_notebook_situation( _set: {deletedAt: now} where: {
                notebookId: {_eq: $notebookId},
                id: {_in: $situationIdsToDelete},
                deletedAt: {_is_null: true}
            }) {
                affected_rows
            }
            insert_notebook_situation(objects: $situationsToAdd) {
                affected_rows
            }
        }

    """
    )
    await client.execute(
        mutation,
        variable_values={
            "notebookId": notebookId,
            "situationsToAdd": situations_to_add,
            "situationIdsToDelete": situation_ids_to_delete,
        },
    )
