import asyncio
import logging

import asyncpg
from api.core.settings import settings

logging.basicConfig(level=logging.INFO)


async def main():

    logging.info(f"Using Database URL: {settings.hasura_graphql_database_url}")

    pool = await asyncpg.create_pool(settings.hasura_graphql_database_url)

    # Take a connection from the pool.
    async with pool.acquire() as connection:
        # Open a transaction.
        async with connection.transaction():
            # Run the query passing the request argument.
            #
            beneficiaries = await connection.fetch("SELECT * FROM public.beneficiary")

            logging.info(beneficiaries)


if __name__ == "__main__":
    asyncio.run(main())
