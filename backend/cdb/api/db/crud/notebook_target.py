import logging

from gql import gql
from gql.client import AsyncClientSession

from cdb.api.v1.payloads.notebook_target import (
    CreatedNotebookTarget,
    CreateNotebookTargetInput,
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
            notebook_target: insert_notebook_target_one(object:  $target) {id}
        }"""
        ),
        variable_values={
            "target": {
                "focusId": notebook_target.focus_id,
                "target": notebook_target.target,
            }
        },
    )
    return CreatedNotebookTarget(id=result["notebook_target"]["id"])
