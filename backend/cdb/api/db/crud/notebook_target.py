import logging

from gql import gql
from gql.client import AsyncClientSession

from cdb.api.v1.payloads.notebook_target import (
    CreatedNotebookTarget,
    CreateNotebookTargetInput,
    UpdatedNotebookTarget,
    UpdateNotebookTargetActionInput,
)

logger = logging.getLogger(__name__)


async def insert_notebook_target(
    client: AsyncClientSession,
    notebook_target: CreateNotebookTargetInput,
) -> CreatedNotebookTarget:
    result = await client.execute(
        gql(
            """
        mutation($target: notebook_target_insert_input!){
            notebook_target: insert_notebook_target_one(object: $target) {id}
        }"""
        ),
        variable_values={
            "target": {
                "focusId": notebook_target.focus_id,
                "target": notebook_target.target,
                "linkedTo": notebook_target.linked_to,
                "userConsent": notebook_target.user_consent,
            }
        },
    )
    return CreatedNotebookTarget(id=result["notebook_target"]["id"])


async def update_notebook_target(
    client: AsyncClientSession,
    notebook_target: UpdateNotebookTargetActionInput,
) -> UpdatedNotebookTarget:
    result = await client.execute(
        gql(
            """
        mutation($status: String!, $id: uuid!, $linkedTo: String!) {
          notebook_target: update_notebook_target_by_pk(
            _set: { status: $status, linkedTo: $linkedTo},
            pk_columns: { id: $id }) {
             id
            }
        }"""
        ),
        variable_values={
            "id": notebook_target.id,
            "status": notebook_target.status,
            "linkedTo": notebook_target.linked_to,
        },
    )
    return UpdatedNotebookTarget(id=result["notebook_target"]["id"])
