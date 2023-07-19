import json
from datetime import datetime
from typing import List
from uuid import UUID

from gql import gql
from gql.client import AsyncClientSession
from pydantic import BaseModel

from cdb.api.domain.contraintes import FocusDifferences, FocusToAdd


class TargetInsertInput(BaseModel):
    target: str


class TargetData(BaseModel):
    data: List[TargetInsertInput]


class FocusInsertInput(BaseModel):
    theme: str
    notebookId: UUID
    createdAt: None | datetime = None
    targets: TargetData | None = None

    def jsonb(self) -> dict:
        return json.loads(self.json())


def to_focuses_insert_input(notebook_id: UUID, focuses: List[FocusToAdd]) -> List[dict]:
    return [
        FocusInsertInput(
            notebookId=notebook_id,
            theme=focus.theme,
            createdAt=focus.created_at,
            targets=TargetData(
                data=[
                    TargetInsertInput(target=target.target) for target in focus.targets
                ]
            ),
        ).jsonb()
        for focus in focuses
    ]


async def add_remove_notebook_focuses(
    client: AsyncClientSession, notebook_id: UUID, focus_differences: FocusDifferences
):
    mutation = gql(
        """
        mutation (
            $focuses_to_add: [notebook_focus_insert_input!]!
            $focuses_ids_to_delete: [uuid!]!
            $targets_to_add: [notebook_target_insert_input!]!
            $target_ids_to_cancel: [uuid!]!
            $target_ids_to_end: [uuid!]!
        ) {
            insert_notebook_focus(objects: $focuses_to_add) {
                affected_rows
            }
            delete_notebook_focus(where: { id: { _in: $focuses_ids_to_delete } }) {
                affected_rows
            }
            insert_notebook_target(objects: $targets_to_add) {
                affected_rows
            }
            update_notebook_target_many(
                updates: [
                {
                    where: { id: { _in: $target_ids_to_cancel } }
                    _set: { status: "abandonned" }
                }
                { where: { id: { _in: $target_ids_to_end } }, _set: { status: "done" } }
                ]
            ) {
                affected_rows
            }
        }"""
    )

    await client.execute(
        mutation,
        variable_values={
            "focuses_to_add": to_focuses_insert_input(
                notebook_id, focus_differences.focuses_to_add
            ),
            "focuses_ids_to_delete": focus_differences.focus_ids_to_delete,
            "targets_to_add": [
                target.jsonb()
                for target in focus_differences.target_differences.targets_to_add
            ],
            "target_ids_to_cancel": focus_differences.target_differences.target_ids_to_cancel,  # noqa: E501
            "target_ids_to_end": focus_differences.target_differences.target_ids_to_end,
        },
    )
