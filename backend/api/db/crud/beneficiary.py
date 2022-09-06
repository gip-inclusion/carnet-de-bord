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
from api.db.models.beneficiary import Beneficiary

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
