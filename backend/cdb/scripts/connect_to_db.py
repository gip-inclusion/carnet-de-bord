import asyncio
import logging

from cdb.api.core.db import get_connection_pool
from cdb.api.core.settings import settings

logging.basicConfig(level=logging.INFO, format=settings.LOG_FORMAT)


async def main():

    logging.info(f"Using Database URL: {settings.database_url}")

    pool = await get_connection_pool(settings.database_url)

    if pool:
        logging.error("Unable to acquire connection from DB pool")


if __name__ == "__main__":
    asyncio.run(main())
