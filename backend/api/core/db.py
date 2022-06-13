import asyncpg
from asyncpg.pool import Pool


async def get_connection_pool(database_url: str) -> Pool | None:
    return await asyncpg.create_pool(database_url, min_size=2, max_size=5)
