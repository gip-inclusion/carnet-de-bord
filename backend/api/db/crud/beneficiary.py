import logging
from datetime import date
from typing import List
from uuid import UUID

from asyncpg import Record
from asyncpg.connection import Connection

from api.db.crud.notebook import (
    NOTEBOOK_BASE_FIELDS,
    NOTEBOOK_BASE_JOINS,
    parse_notebook_from_record,
)
from api.db.models.beneficiary import Beneficiary, BeneficiaryImport

logger = logging.getLogger(__name__)

BENEFICIARY_BASE_QUERY = (
    """SELECT b.*, acc.id as account_id,"""
    + NOTEBOOK_BASE_FIELDS
    + """
    FROM public.beneficiary b
    LEFT JOIN notebook n ON n.beneficiary_id = b.id
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
        f"""
SELECT *
FROM beneficiary
WHERE (lower(trim(firstname)) = $1 AND lower(trim(lastname)) = $2 AND date_of_birth = $3)
OR (internal_id = $4 AND deployment_id = $5)
        """,
        beneficiary.firstname,
        beneficiary.lastname,
        beneficiary.date_of_birth,
        beneficiary.si_id,
        deployment_id,
    )
    return [
        Beneficiary.parse_obj(beneficiary) for beneficiary in matching_beneficiaries
    ]


async def update_beneficiary(
    connection: Connection,
    beneficiary: BeneficiaryImport,
    deployment_id,
    id,
):
    return await connection.fetchrow(
        f"""
UPDATE beneficiary SET mobile_number = $2,
    address1 = $3,
    address2 = $4,
    postal_code = $5,
    city = $6,
    caf_number = $7,
    pe_number = $8,
    email = $9
where id = $1
returning id
        """,
        id,
        beneficiary.phone_number,
        beneficiary.address1,
        beneficiary.address2,
        beneficiary.postal_code,
        beneficiary.city,
        beneficiary.caf_number,
        beneficiary.pe_number,
        beneficiary.email,
    )


async def insert_beneficiary(
    connection: Connection,
    beneficiary: BeneficiaryImport,
    deployment_id,
):
    return await connection.fetchrow(
        f"""
INSERT INTO BENEFICIARY (
    firstname,
    lastname,
    internal_id,
    date_of_birth,
    deployment_id,
    place_of_birth,
    mobile_number,
    address1,
    address2,
    postal_code,
    city,
    caf_number,
    pe_number,
    email
    )
values ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14)
returning id
        """,
        beneficiary.firstname,
        beneficiary.lastname,
        beneficiary.si_id,
        beneficiary.date_of_birth,
        deployment_id,
        beneficiary.place_of_birth,
        beneficiary.phone_number,
        beneficiary.address1,
        beneficiary.address2,
        beneficiary.postal_code,
        beneficiary.city,
        beneficiary.caf_number,
        beneficiary.pe_number,
        beneficiary.email,
    )


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


async def get_beneficiary_by_id(
    connection: Connection, beneficiary_id: UUID
) -> Beneficiary | None:

    return await get_beneficiary_with_query(
        connection, "WHERE b.id = $1", beneficiary_id
    )
