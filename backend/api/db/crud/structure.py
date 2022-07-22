import logging
from uuid import UUID

from asyncpg import Record
from asyncpg.connection import Connection

from api.db.models.structure import Structure, StructureInsert
from pe.models.agence import Agence


def parse_structure_from_record(record: Record) -> Structure:
    return Structure.parse_obj(record)


async def insert_structure(
    connection: Connection, structure_insert: StructureInsert
) -> Structure | None:

    record = await connection.fetchrow(
        """
        INSERT INTO public.structure (siret, name, short_desc, phone, email, postal_code, city, address1, address2, website, deployment_id)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11) returning id, siret, name, short_desc, phone, email, postal_code, city, address1, address2, website, deployment_id, created_at, updated_at
        """,
        *structure_insert.dict().values(),
    )

    if record:
        return parse_structure_from_record(record)


async def get_structure_by_name(connection: Connection, name: str) -> Structure | None:
    return await get_structure_with_query(
        connection,
        """
        WHERE name=$1
        """,
        name,
    )


async def get_structure_by_id(connection: Connection, id: UUID) -> Structure | None:
    return await get_structure_with_query(
        connection,
        """
        WHERE id=$1
        """,
        id,
    )


async def get_structure_with_query(
    connection: Connection, query: str, *args
) -> Structure | None:

    record: Record | None = await connection.fetchrow(
        """
        SELECT structure.* FROM public.structure {query}
        """.format(
            query=query
        ),
        *args,
    )

    if record:
        return parse_structure_from_record(record)


async def create_structure_from_agences_list(
    connection: Connection, agences: list[Agence], label: str, deployment_id: UUID
) -> Structure | None:

    matching_agences: list[Agence] = [
        agence for agence in agences if agence.libelle == label
    ]

    if len(matching_agences) == 0:
        agence = None
    else:
        agence = matching_agences[0]

    if agence:
        postal_code, city = agence.adressePrincipale.ligne6.split(" ", 1)
        structure_insert = StructureInsert(
            siret=agence.siret,
            name=agence.libelle,
            short_desc=agence.libelleEtendu,
            phone=agence.contact.telephonePublic,
            email=agence.contact.email,
            postal_code=postal_code,
            city=city,
            address1=agence.adressePrincipale.ligne4,
            address2=agence.adressePrincipale.ligne5,
            deployment_id=deployment_id,
            website=None,
        )

        return await insert_structure(connection, structure_insert)
    else:
        logging.error(
            "Agence '{}' in CSV not found in PE API response, unable to create structure. Skipping.".format(
                label
            )
        )
        return
