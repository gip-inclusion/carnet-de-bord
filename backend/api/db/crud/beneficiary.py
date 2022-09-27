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


async def select_beneficiary(
    connection: Connection,
    beneficiary: BeneficiaryImport,
    deployment_id,
):
    return await connection.fetch(
        f"""
SELECT firstname, lastname, date_of_birth, internal_id, deployment_id, id
FROM beneficiary
WHERE (lower(trim(firstname)) = lower(trim($1)) AND lower(trim(lastname)) = lower(trim($2)) AND date_of_birth = $3)
OR (internal_id = $4 AND deployment_id = $5)
        """,
        beneficiary.firstname,
        beneficiary.lastname,
        beneficiary.date_of_birth,
        beneficiary.si_id,
        deployment_id,
    )


async def update_beneficiary(
    connection: Connection,
    beneficiary: BeneficiaryImport,
    deployment_id,
):
    return await connection.fetchrow(
        f"""
UPDATE beneficiary SET mobile_number = $1
where internal_id = $2
returning id
        """,
        beneficiary.phone_number,
        beneficiary.si_id,
    )


async def insert_beneficiary(
    connection: Connection,
    beneficiary: BeneficiaryImport,
    deployment_id,
):
    return await connection.fetchrow(
        f"""
INSERT INTO BENEFICIARY (firstname, lastname, internal_id, date_of_birth, deployment_id, mobile_number)
values ($1, $2, $3, $4, $5, $6)
returning id
        """,
        beneficiary.firstname,
        beneficiary.lastname,
        beneficiary.si_id,
        beneficiary.date_of_birth,
        deployment_id,
        beneficiary.phone_number,
    )


async def import_beneficiary(
    connection: Connection,
    beneficiary: BeneficiaryImport,
    deployment_id,
):
    existing_rows = await select_beneficiary(connection, beneficiary, deployment_id)
    if len(existing_rows) == 0:
        record = await insert_beneficiary(connection, beneficiary, deployment_id)
        logger.info("insert new beneficiary %s", record["id"])
    else:
        if (
            len(existing_rows) == 1
            and existing_rows[0]["firstname"].lower().strip()
            == beneficiary.firstname.lower().strip()
            and existing_rows[0]["lastname"].lower().strip()
            == beneficiary.lastname.lower().strip()
            and existing_rows[0]["date_of_birth"] == beneficiary.date_of_birth
            and existing_rows[0]["internal_id"] == beneficiary.si_id
        ):
            # Doesn't work somehow
            #     and existing_rows[0][0][4] == deployment_id
            record = await update_beneficiary(connection, beneficiary, deployment_id)
            logger.info("update existing info for beneficiary %s", record["id"])
        else:
            logger.info(
                "block update for beneficiary %s",
                [beneficiary["id"] for beneficiary in existing_rows],
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
