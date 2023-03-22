import logging

from asyncpg import Record
from asyncpg.connection import Connection

from cdb.api.db.models.professional import Professional, ProfessionalInsert

logger = logging.getLogger(__name__)


async def get_professional_with_query(
    connection: Connection, query: str, *args
) -> Professional | None:
    async with connection.transaction():

        professional_record: Record | None = await connection.fetchrow(
            "SELECT public.professional.*, public.account.id as account_id "
            "FROM public.professional "
            "LEFT JOIN public.account "
            "ON public.account.professional_id = public.professional.id " + query,
            *args,
        )

        if professional_record:
            return Professional.parse_obj(professional_record)


async def get_professional_by_email(
    connection: Connection, email: str
) -> Professional | None:
    return await get_professional_with_query(
        connection,
        "WHERE LOWER(public.professional.email) = LOWER($1)",
        email,
    )


async def insert_professional(
    connection: Connection, professional_insert: ProfessionalInsert
) -> Professional | None:

    record = await connection.fetchrow(
        """
        INSERT INTO public.professional (structure_id, email, lastname, firstname, position, mobile_number)
        VALUES ($1, $2, $3, $4, $5, $6)
        RETURNING id, structure_id, email, lastname, firstname, position, mobile_number, created_at, updated_at
        """,  # noqa: E501
        *professional_insert.dict().values(),
    )

    if record:
        return await parse_professional_from_record(record)


async def parse_professional_from_record(record: Record) -> Professional:
    return Professional.parse_obj(record)
