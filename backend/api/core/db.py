import asyncpg
from asyncpg.pool import Pool

from api.core.settings import settings


async def get_connection_pool(database_url: str) -> Pool | None:
    return await asyncpg.create_pool(
        database_url, min_size=settings.min_pool_size, max_size=settings.max_pool_size
    )
