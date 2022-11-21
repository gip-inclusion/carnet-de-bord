import logging
from datetime import date
from typing import List
from uuid import UUID

from asyncpg import Record
from asyncpg.connection import Connection

from api.core.exceptions import InsertFailError
from api.db.crud.notebook import (
    NOTEBOOK_BASE_FIELDS,
    NOTEBOOK_BASE_JOINS,
    insert_notebook,
    insert_notebook_member,
    parse_notebook_from_record,
)
from api.db.crud.notebook_info import insert_or_update_need_orientation
from api.db.crud.professional import get_professional_by_email
from api.db.crud.structure import get_structure_by_name
from api.db.crud.wanted_job import insert_wanted_jobs
from api.db.models.beneficiary import (
    Beneficiary,
    BeneficiaryImport,
    BeneficiaryStructure,
)
from api.db.models.notebook_member import NotebookMemberInsert
from api.db.models.professional import Professional

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
        """
SELECT *
FROM beneficiary
WHERE (lower(trim(firstname)) = lower(trim($1)) AND lower(trim(lastname)) = lower(trim($2)) AND date_of_birth = $3 AND deployment_id = $5)
OR (internal_id = $4 AND deployment_id = $5)
        """,
        beneficiary.firstname,
        beneficiary.lastname,
        beneficiary.date_of_birth,
        beneficiary.internal_id,
        deployment_id,
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
    fields: list[tuple[str, str | None]],
    beneficiary_id: UUID,
) -> UUID | None:

    ALLOWED_FIELDS_UPDATE = [
        "place_of_birth",
        "mobile_number",
        "address1",
        "address2",
        "postal_code",
        "city",
        "caf_number",
        "pe_number",
        "email",
        "nir",
    ]

    fields_to_update = [
        (key, value) for (key, value) in fields if key in ALLOWED_FIELDS_UPDATE
    ]
    # Special case for address where we need to clean address2 if address1 is provided but not address2
    field_keys = [key for (key, _) in fields_to_update]
    if "address1" in field_keys and "address2" not in field_keys:
        fields_to_update.append(("address2", None))

    if len(fields_to_update) == 0:
        logger.info("trying to udpate beneficiary but no fields where updated.")
        return beneficiary_id
    sql_fields = [
        # ["postal_code = $2", ...]
        f"{key} = ${index+2}"
        for (index, (key, _)) in enumerate(fields_to_update)
    ]
    sql_values = [value for (_, value) in fields_to_update]

    sql = f"""
            UPDATE beneficiary
                SET {", ".join(sql_fields)}
                WHERE id=$1
                returning id
        """

    result = await connection.fetchrow(
        sql,
        beneficiary_id,
        *sql_values,
    )

    if result:
        return result["id"]


async def insert_beneficiary(
    connection: Connection,
    beneficiary: BeneficiaryImport,
    deployment_id,
) -> UUID | None:
    created_beneficiary: Record = await connection.fetchrow(
        """
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
    email,
    nir
    )
values ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15)
returning id
        """,
        beneficiary.firstname,
        beneficiary.lastname,
        beneficiary.internal_id,
        beneficiary.date_of_birth,
        deployment_id,
        beneficiary.place_of_birth,
        beneficiary.mobile_number,
        beneficiary.address1,
        beneficiary.address2,
        beneficiary.postal_code,
        beneficiary.city,
        beneficiary.caf_number,
        beneficiary.pe_number,
        beneficiary.email,
        beneficiary.nir,
    )

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


async def create_beneficiary_with_notebook_and_referent(
    connection: Connection,
    beneficiary: BeneficiaryImport,
    deployment_id: UUID,
    need_orientation: bool,
) -> UUID:

    beneficiary_id: UUID | None = await insert_beneficiary(
        connection, beneficiary, deployment_id
    )

    if not beneficiary_id:
        raise InsertFailError("insert beneficiary failed")

    new_notebook_id: UUID | None = await insert_notebook(
        connection, beneficiary_id, beneficiary
    )

    if not new_notebook_id:
        raise InsertFailError("insert notebook failed")

    await insert_or_update_need_orientation(
        connection, new_notebook_id, None, need_orientation
    )

    await insert_wanted_jobs(connection, new_notebook_id, beneficiary)
    await add_referent_and_structure_to_beneficiary(
        connection, beneficiary_id, new_notebook_id, beneficiary
    )
    logger.info("inserted new beneficiary %s", beneficiary_id)
    return beneficiary_id


async def add_referent_and_structure_to_beneficiary(
    connection: Connection,
    beneficiary_id: UUID,
    notebook_id: UUID,
    beneficiary: BeneficiaryImport,
):
    structure = None
    if beneficiary.structure_name:
        structure = await get_structure_by_name(connection, beneficiary.structure_name)
        if structure is None:
            # Si une structure est fournie dans l'import mais n'existe pas, on ne fait rien.
            logger.info(
                'Trying to associate structure with beneficiary: structure "%s" does not exist',
                beneficiary.structure_name,
            )
            return
    referent = None
    if beneficiary.advisor_email:
        referent: Professional | None = await get_professional_by_email(
            connection, beneficiary.advisor_email.strip()
        )
    if structure:
        # Si on a pu récupérer la structure, on associe la structure au bénéficiaire.
        # Le status indique si la structure a déjà désigné un référent unique.
        if referent and referent.structure_id == structure.id:
            # Si on a structure ET un référent, le status est 'done'
            status = "done"
        else:
            # Sinon c'est 'pending'.
            status = "pending"
        await add_beneficiary_to_structure(
            connection, beneficiary_id, structure.id, status
        )
    elif referent:
        # Si la structure n'est pas fournie dans l'import mais le référent est fourni,
        # Alors on ajout la structure du référent au bénéficiaire avec le status 'done'.
        await add_beneficiary_to_structure(
            connection, beneficiary_id, referent.structure_id, "done"
        )

    if referent and referent.account_id:
        # Si on a pu récupérer le compte du référent fourni, on l'ajoute dans le
        # groupe de suivi en tant que référent.
        if not structure or structure.id == referent.structure_id:
            referent_member = NotebookMemberInsert(
                notebook_id=notebook_id,
                account_id=referent.account_id,
                member_type="referent",
            )
            await insert_notebook_member(connection, referent_member)
    else:
        # Si un référent est fourni mais qu'on ne le connaît pas, on ne fait rien.
        logger.info(
            "trying to create referent: no account with email: %s",
            beneficiary.advisor_email,
        )
