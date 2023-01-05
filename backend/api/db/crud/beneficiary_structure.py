from uuid import UUID

from gql.dsl import DSLField, DSLSchema


def deactivate_beneficiary_structure(
    dsl_schema: DSLSchema,
    beneficiary_id: UUID,
) -> dict[str, DSLField]:
    return {
        "deactivate_old_structure": dsl_schema.mutation_root.update_beneficiary_structure.args(
            where={
                "beneficiaryId": {"_eq": str(beneficiary_id)},
                "status": {"_eq": "current"},
            },
            _set={"status": "outdated"},
        ).select(
            dsl_schema.beneficiary_structure_mutation_response.affected_rows
        ),
    }


def insert_beneficiary_structure(
    dsl_schema: DSLSchema,
    beneficiary_id: UUID,
    structure_id: UUID,
) -> dict[str, DSLField]:
    return {
        "add_new_structure": dsl_schema.mutation_root.insert_beneficiary_structure_one.args(
            object={
                "beneficiaryId": str(beneficiary_id),
                "structureId": str(structure_id),
                "status": "current",
            },
        ).select(
            dsl_schema.beneficiary_structure.id
        ),
    }
