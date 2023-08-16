import logging
from datetime import date
from typing import List
from uuid import UUID

from asyncpg import Record
from asyncpg.connection import Connection
from gql import gql
from graphql import DocumentNode

from cdb.api.db.crud.notebook import (
    NOTEBOOK_BASE_FIELDS,
    NOTEBOOK_BASE_JOINS,
    parse_notebook_from_record,
)
from cdb.api.db.models.beneficiary import (
    Beneficiary,
    BeneficiaryImport,
    BeneficiaryStructure,
    BeneficiaryWithAdminStructureEmail,
)
from cdb.api.db.models.deployment import parse_deployment_from_beneficiary_record
from cdb.api.db.models.orientation_system import OrientationSystem

logger = logging.getLogger(__name__)

BENEFICIARY_BASE_QUERY = (
    """
    SELECT b.*, acc.id as account_id,
    dep.id as dep_id, dep.label as dep_label, dep.department_code as dep_code,
    """
    + NOTEBOOK_BASE_FIELDS
    + """
    FROM public.beneficiary b
    LEFT JOIN notebook n ON n.beneficiary_id = b.id
    LEFT JOIN deployment dep on dep.id = b.deployment_id
    """
    + NOTEBOOK_BASE_JOINS
    + """
    LEFT JOIN public.account acc
    ON acc.beneficiary_id = b.id
"""
)


# see https://betakuang.medium.com/why-postgresqls-on-conflict-cannot-find-my-partial-unique-index-552327b85e1
firstname_lastname_date_of_birth_unique_idx = (
    "(LOWER(trim(firstname)), LOWER(trim(lastname)), date_of_birth, deployment_id)"
)


async def get_beneficiaries_like(
    connection: Connection,
    beneficiary: BeneficiaryImport,
    deployment_id,
) -> list[Beneficiary]:
    matching_beneficiaries: list[Record] = await connection.fetch(
        """
        SELECT *
        FROM beneficiary
        WHERE (
            lower(trim(firstname)) = lower(trim($1))
            AND lower(trim(lastname)) = lower(trim($2))
            AND date_of_birth = $3 AND deployment_id = $5
        ) OR (external_id = $4 AND deployment_id = $5)
        OR (nir = $6)
        """,
        beneficiary.firstname,
        beneficiary.lastname,
        beneficiary.date_of_birth,
        beneficiary.external_id,
        deployment_id,
        beneficiary.nir,
    )
    return [
        Beneficiary.parse_obj(beneficiary) for beneficiary in matching_beneficiaries
    ]


async def update_beneficiary_field(
    connection: Connection,
    field_name: str,
    field_value: str,
    beneficiary_id: UUID,
) -> UUID | None:
    result: Record | None = await connection.fetchrow(
        f"""
UPDATE beneficiary SET {field_name} = $2
where id = $1
returning id
        """,
        beneficiary_id,
        field_value,
    )
    if result:
        return result["id"]


async def update_beneficiary(
    connection: Connection,
    beneficiary: BeneficiaryImport,
    beneficiary_id: UUID,
) -> UUID | None:
    keys_to_update = beneficiary.get_beneficiary_editable_keys()

    if len(keys_to_update) == 0:
        logger.info("trying to update beneficiary but no fields where updated.")
        return beneficiary_id

    sql_fields = [f"{key} = ${index+2}" for (index, key) in enumerate(keys_to_update)]

    sql = f"""
        UPDATE beneficiary
        SET {", ".join(sql_fields)}
        WHERE id=$1
            returning id
"""

    result = await connection.fetchrow(
        sql,
        beneficiary_id,
        *beneficiary.get_values_for_keys(keys_to_update),
    )

    if result:
        return result["id"]


async def insert_beneficiary(
    connection: Connection,
    beneficiary: BeneficiaryImport,
    deployment_id,
) -> UUID | None:
    mandatory_keys = ["firstname", "lastname", "external_id", "date_of_birth"]
    keys_to_insert = mandatory_keys + beneficiary.get_beneficiary_editable_keys()
    sql_values = beneficiary.get_values_for_keys(keys_to_insert)
    keys_to_insert.append("deployment_id")
    sql_values.append(deployment_id)
    sql = f"""
        INSERT INTO public.beneficiary ({", ".join(keys_to_insert)})
        VALUES ({", ".join([f"${x+1}" for x in range(len(keys_to_insert))])})
            returning id
"""
    created_beneficiary: Record = await connection.fetchrow(sql, *sql_values)

    if created_beneficiary:
        return created_beneficiary["id"]


async def get_beneficiary_with_query(
    connection: Connection, query: str, *args
) -> Beneficiary | None:
    async with connection.transaction():
        beneficiary = None

        beneficiary_records: List[Record] = await connection.fetch(
            BENEFICIARY_BASE_QUERY + query,
            *args,
        )

        for beneficiary_record in beneficiary_records:
            if beneficiary is None:
                beneficiary = Beneficiary.parse_obj(beneficiary_record)
                beneficiary.deployment = parse_deployment_from_beneficiary_record(
                    beneficiary_record
                )
            if beneficiary_record["n_id"] is not None:
                beneficiary.notebook = await parse_notebook_from_record(
                    beneficiary_record,
                    notebook=beneficiary.notebook,
                )

        return beneficiary


async def get_beneficiary_from_personal_information(
    connection: Connection, firstname: str, lastname: str, birth_date: date
) -> Beneficiary | None:
    return await get_beneficiary_with_query(
        connection,
        # We use LOWER(BTRIM(field)) here to match the index so postgres
        # can use the index rather than scanning the whole table
        "WHERE LOWER(BTRIM(b.firstname)) = LOWER($1) AND "
        "LOWER(BTRIM(b.lastname)) = LOWER($2) AND "
        "b.date_of_birth = $3",
        firstname,
        lastname,
        birth_date,
    )


async def add_beneficiary_to_structure(
    connection: Connection,
    beneficiary_id: UUID,
    structure_id: UUID,
    status: str,
) -> UUID | None:
    result = await connection.fetchrow(
        """
INSERT INTO beneficiary_structure (beneficiary_id, structure_id, status)
VALUES ($1, $2, $3)
RETURNING id
        """,
        beneficiary_id,
        structure_id,
        status,
    )
    if result:
        return result["id"]


async def get_structures_for_beneficiary(
    connection: Connection,
    beneficiary_id: UUID,
) -> list[BeneficiaryStructure]:
    rows: list[Record] = await connection.fetch(
        """
SELECT struct.id, struct.name, b_struct.status
FROM public.beneficiary_structure AS b_struct
LEFT JOIN public.structure AS struct
    ON struct.id = b_struct.structure_id
WHERE b_struct.beneficiary_id = $1
        """,
        beneficiary_id,
    )
    return [
        BeneficiaryStructure(
            structure_id=row["id"],
            structure_name=row["name"],
            beneficiary_status=row["status"],
        )
        for row in rows
    ]


async def get_beneficiary_by_id(
    connection: Connection, beneficiary_id: UUID
) -> Beneficiary | None:
    return await get_beneficiary_with_query(
        connection, "WHERE b.id = $1", beneficiary_id
    )


async def get_beneficiaries_without_referent(
    connection: Connection,
) -> list[BeneficiaryWithAdminStructureEmail]:
    rows: list[Record] = await connection.fetch(
        """
SELECT b.firstname, b.lastname, b.date_of_birth,
    os.id as orientation_id, os.name as orientation_name,
    os.orientation_type as orientation_type,
    os.created_at as orientation_created_at,
    os.updated_at as orientation_updated_at,
    ads.email AS admin_structure_email, s.name AS structure_name
FROM beneficiary AS b
LEFT JOIN notebook AS n ON n.beneficiary_id = b.id
LEFT JOIN notebook_info AS ni ON ni.notebook_id = n.id
LEFT JOIN (
    SELECT * FROM notebook_member AS nm
    WHERE nm.active AND nm.member_type = 'referent'
    ) referent ON referent.notebook_id = n.id
LEFT JOIN orientation_system AS os ON os.id = ni.orientation_system_id
LEFT JOIN account_info  AS ai ON referent.account_id = ai.account_id
LEFT JOIN beneficiary_structure bs ON bs.beneficiary_id = b.id
LEFT JOIN admin_structure_structure ass ON ass.structure_id = bs.structure_id
    AND ass.deleted_at IS NULL
LEFT JOIN admin_structure ads ON ads.id = ass.admin_structure_id
LEFT JOIN structure s ON s.id = ass.structure_id
WHERE referent IS NULL AND ads.email IS NOT NULL AND status = 'current'
ORDER BY ads.email ASC, s.name ASC, firstname ASC, lastname ASC, date_of_birth ASC;
        """
    )
    return [
        BeneficiaryWithAdminStructureEmail(
            admin_structure_email=row["admin_structure_email"],
            structure_name=row["structure_name"],
            firstname=row["firstname"],
            lastname=row["lastname"],
            date_of_birth=row["date_of_birth"],
            orientation=OrientationSystem(
                id=row["orientation_id"],
                name=row["orientation_name"],
                orientation_type=row["orientation_type"],
                created_at=row["orientation_created_at"],
                updated_at=row["orientation_updated_at"],
            )
            if row["orientation_id"] is not None
            else None,
        )
        for row in rows
    ]


search_beneficiary_by_nir_query_gql: DocumentNode = gql(
    """
        query($nir: String!) {
            beneficiaries: get_beneficiaries_from_nir(args: {search_nir: $nir}) {
               deploymentId
               notebook { id }
            }
        }
"""
)


# Question : quid de la structure ?
# (comment la trouver et créer la beneficiary_structure associée)
get_insert_beneficiary_mutation_gql: DocumentNode = gql(
    """
        mutation (
            $nir: String!,
            $firstname: String!,
            $lastname: String!,
            $dateOfBirth: date!,
            $externalId: String,
            $mobileNumber: String,
            $email: citext,
            $address1: String,
            $address2: String,
            $postalCode: String,
            $city: String,
            $cafNumber: String,
        ) {
            insert_beneficiary_one(object: {
               nir: $nir,
               firstname: $firstname,
               lastname: $lastname,
               dateOfBirth: $dateOfBirth,
               externalId: $externalId,
               mobileNumber: $mobileNumber,
               email: $email,
               address1: $address1,
               address2: $address2,
               postalCode: $postalCode,
               city: $city,
               cafNumber: $cafNumber,
               notebook: {data: {}}
            }) {
                notebook {
                    id
                }
            }
        }

    """
)


insert_notebook_creation_gql: DocumentNode = gql(
    """
    mutation (
        $accountId: uuid!
        $notebookId: uuid!
        $createdAt: timestamptz = now
        $source: notebook_creation_source_type_enum
        ) {
        insert_notebook_creation_one(
            object: {
            creatorAccountId: $accountId
            notebookId: $notebookId
            createdAt: $createdAt
            source: $source
            }
        ) {
            id
        }
        }

"""
)


update_diagnostic_fetch_date_gql: DocumentNode = gql(
    """
        mutation update_notebook_by_pk($notebook_id: uuid!) {
            update_notebook_by_pk(
                pk_columns: {id: $notebook_id}
                _set: {diagnosticFetchedAt: now}
            ){
                diagnosticFetchedAt
            }
        }

        """
)
