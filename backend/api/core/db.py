import asyncpg


async def get_connection_pool(database_url: str):
    return await asyncpg.create_pool(database_url)
