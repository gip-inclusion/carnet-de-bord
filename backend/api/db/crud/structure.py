from typing import List

from asyncpg import Record
from asyncpg.connection import Connection

from api.db.models.structure import Structure, StructureInsert


def parse_structure_from_record(record: Record) -> Structure:
    return Structure.parse_obj(record)


async def insert_structure(
    connection: Connection, structure_insert: StructureInsert
) -> Structure | None:

    print(structure_insert.dict())
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

    return parse_structure_from_record(record)
