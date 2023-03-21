from datetime import datetime
from uuid import UUID

from gql.dsl import DSLField, DSLSchema

from cdb.api.db.models.member_type import MemberTypeEnum


def get_insert_notebook_member_mutation(
    dsl_schema: DSLSchema,
    notebook_id: UUID,
    new_referent_account_id: UUID,
    member_type: MemberTypeEnum,
):
    return {
        "create_notebook_member_row": (
            dsl_schema.mutation_root.insert_notebook_member_one.args(
                object={
                    "notebookId": str(notebook_id),
                    "accountId": str(new_referent_account_id),
                    "memberType": member_type.value,
                },
            ).select(dsl_schema.notebook_member.id)
        ),
    }


def get_insert_former_referent_notebook_member_mutation(
    dsl_schema: DSLSchema,
    notebook_id: UUID,
    former_referent_account_id: UUID,
) -> dict[str, DSLField]:
    return {
        "create_former_referent_row": (
            dsl_schema.mutation_root.insert_notebook_member_one.args(
                object={
                    "notebookId": str(notebook_id),
                    "accountId": str(former_referent_account_id),
                    "memberType": "no_referent",
                },
            ).select(dsl_schema.notebook_member.id)
        ),
    }


def get_deactivate_notebook_members_mutation(
    dsl_schema: DSLSchema, notebook_id: UUID, new_referent_account_id: UUID | None
) -> dict[str, DSLField]:
    deactivation_clause = [
        {
            "notebookId": {"_eq": str(notebook_id)},
            "memberType": {"_eq": "referent"},
            "active": {"_eq": True},
        }
    ]
    if new_referent_account_id:
        deactivation_clause.append(
            {
                "notebookId": {"_eq": str(notebook_id)},
                "accountId": {"_eq": str(new_referent_account_id)},
                "active": {"_eq": True},
            }
        )

    return {
        "deactivate_changed_member_rows": (
            dsl_schema.mutation_root.update_notebook_member.args(
                where={"_or": deactivation_clause},
                _set={
                    "active": False,
                    "membershipEndedAt": datetime.now().isoformat(),
                },
            ).select(dsl_schema.notebook_member_mutation_response.affected_rows)
        ),
    }
