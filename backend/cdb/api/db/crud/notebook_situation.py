from typing import List, Tuple
from uuid import UUID

from gql import gql
from gql.client import AsyncClientSession

from cdb.api.db.models.ref_situation import NotebookSituation, RefSituation
from cdb.api.v1.payloads.socio_pro import SituationToAdd


async def get_ref_situations_with_notebook_situations(
    client: AsyncClientSession, notebook_id: UUID
) -> Tuple[List[RefSituation], List[NotebookSituation]]:
    query = gql(
        """
        query getRefSituation($notebookId: uuid!) {
            ref_situation {
                id, description, theme
            }
            notebook_situation(where: {
                notebookId: {_eq: $notebookId}
                deletedAt: {_is_null: true}
            }, order_by: {createdAt: desc}
            ) {
                id situationId createdAt
            }
        }
    """
    )
    response = await client.execute(query, variable_values={"notebookId": notebook_id})
    ref_situations = response.get("ref_situation")
    notebook_situations = response.get("notebook_situation")
    if not ref_situations:
        return ([], [])
    ref_situations_parsed = [
        RefSituation.parse_obj(situation) for situation in ref_situations
    ]
    if not notebook_situations:
        return (ref_situations_parsed, [])

    notebook_situations_parsed = [
        NotebookSituation.parse_obj(situation) for situation in notebook_situations
    ]

    return (ref_situations_parsed, notebook_situations_parsed)


async def save_notebook_situations(
    client: AsyncClientSession,
    notebookId: UUID,
    situations_to_add: List[SituationToAdd],
    situation_ids_to_delete: List[UUID],
):
    mutation = gql(
        """
        mutation saveSituations(
            $notebookId: uuid!,
            $situationsToAdd: [notebook_situation_insert_input!]!,
            $situationIdsToDelete: [uuid!]!
        ) {
            update_notebook_situation(where: {
                notebookId: {_eq: $notebookId},
                situationId: {_in: $situationIdsToDelete},
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
