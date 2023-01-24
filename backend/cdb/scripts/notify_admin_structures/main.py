import asyncio
import logging

from cdb.api.core.db import get_connection_pool
from cdb.api.core.settings import settings
from cdb.scripts.notify_admin_structures.notify_admin_structures import (
    notify_admin_structures,
)

logging.basicConfig(level=logging.INFO, format=settings.LOG_FORMAT)


async def main():
    pool = await get_connection_pool(settings.database_url)

    if pool:
        async with pool.acquire() as connection:
            await notify_admin_structures(connection)

        await pool.close()
    else:
        logging.error("Unable to acquire connection from DB pool")


if __name__ == "__main__":
    asyncio.run(main())
