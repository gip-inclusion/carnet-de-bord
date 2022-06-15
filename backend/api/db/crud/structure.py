from asyncpg import Record
from asyncpg.connection import Connection

from api.db.models.structure import Structure, StructureInsert


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
        return await parse_structure_from_record(record)


async def parse_structure_from_record(record: Record) -> Structure:
    return Structure.parse_obj(record)
