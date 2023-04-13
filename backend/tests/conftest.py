import asyncio
import contextlib
import io
import os
import typing
from typing import Any, AsyncGenerator
from uuid import UUID

import dask.dataframe as dd
import httpx
import pytest
from dask.dataframe.core import DataFrame
from gql.client import AsyncClientSession

from cdb.api.core.db import get_connection_pool
from cdb.api.core.init import create_app
from cdb.api.core.settings import settings
from cdb.api.db.crud.beneficiary import get_beneficiary_by_id
from cdb.api.db.crud.notebook import get_notebook_by_id
from cdb.api.db.crud.orientation_request import get_orientation_request_by_id
from cdb.api.db.crud.orientation_system import get_orientation_system_by_id
from cdb.api.db.crud.professional import get_professional_by_email
from cdb.api.db.graphql.get_client import gql_client
from cdb.api.db.models.beneficiary import Beneficiary, BeneficiaryImport
from cdb.api.db.models.notebook import Notebook
from cdb.api.db.models.orientation_request import OrientationRequest
from cdb.api.db.models.orientation_system import OrientationSystem
from cdb.api.db.models.professional import Professional

test_dir = os.path.dirname(os.path.realpath(__file__))


@pytest.fixture(scope="session")
def event_loop():
    policy = asyncio.get_event_loop_policy()
    loop = policy.new_event_loop()
    yield loop
    loop.close()


class DatabaseWrapper:
    def __init__(self, pool):
        self.pool = pool

    async def create_pool(self) -> None:
        pass

    async def __aenter__(self):
        return self

    async def __aexit__(self, *exc):
        pass


class SingleConnectionDatabase:
    def __init__(self, pool):
        self.real_pool = pool

    async def create_pool(self) -> None:
        pass

    async def __aenter__(self):
        self.pool = SingleConnectionPool(self.real_pool)
        return self

    async def __aexit__(self, *exc):
        await self.pool.close()


class SingleConnectionPool:
    def __init__(self, pool):
        self.pool = pool
        self.connection = None
        self.transaction = None

    def acquire(self):
        @contextlib.asynccontextmanager
        async def connection_holder():
            if self.connection is None:
                self.connection = await self.pool._acquire(timeout=2)
                self.transaction = self.connection.transaction()
                await self.transaction.start()
            yield self.connection

        return connection_holder()

    async def close(self):
        if self.connection is not None:
            await self.transaction.rollback()
            await self.pool.release(self.connection, timeout=2)


class DBState:
    dirty = True

    def __init__(self, pool):
        self.pool = pool

    async def db_wrapped_in_transaction(self) -> contextlib.AbstractAsyncContextManager:
        if self.dirty:
            await self.seed()
        return SingleConnectionDatabase(self.pool)

    async def db_trashable(self) -> contextlib.AbstractAsyncContextManager:
        if self.dirty:
            await self.seed()
        # db_trashable aims to be used in out-of-control contexts. For
        # instance, GraphQL mutations are managed by Hasura, outside of the
        # control of pytest. The database is likely changed at the end of the
        # test.
        self.dirty = True
        return DatabaseWrapper(self.pool)

    async def seed(self):
        seed_filepath = os.path.join(
            test_dir, "..", "..", "hasura", "seeds", "carnet_de_bord", "seed-data.sql"
        )
        with open(seed_filepath, "r", encoding="UTF-8") as file:
            data = file.read()
        async with self.pool.acquire() as connection:
            await connection.execute(data)
        self.dirty = False


@pytest.fixture(scope="session")
async def db_state():
    pool = await get_connection_pool(settings.database_url)
    yield DBState(pool)


@pytest.fixture
async def seeded_db(db_state, request):
    db_cm = await (
        db_state.db_trashable()
        if "graphql" in request.keywords
        else db_state.db_wrapped_in_transaction()
    )
    async with db_cm as db:
        yield db


@pytest.fixture
def test_directory() -> str:
    return test_dir


@pytest.fixture
@pytest.mark.asyncio
async def fastapi_app(seeded_db):
    yield create_app(db=seeded_db)


@pytest.fixture
@pytest.mark.asyncio
async def test_client(fastapi_app):
    async with httpx.AsyncClient(app=fastapi_app, base_url="http://testserver") as c:
        yield c


@pytest.fixture
@pytest.mark.asyncio
async def gql_manager_client(
    get_manager_jwt_93: str,
) -> AsyncGenerator[AsyncClientSession, None]:
    async with await gql_client(
        url=settings.graphql_api_url,
        headers={
            "x-hasura-admin-secret": settings.hasura_graphql_admin_secret,
            "x-hasura-use-backend-only-permissions": "true",
            "Authorization": "Bearer " + get_manager_jwt_93,
        },
    ) as client:
        yield client


@pytest.fixture
def pe_principal_csv_filepath() -> str:
    return os.path.join(
        test_dir,
        "fixtures",
        "i03300c.j.extract_spie_carnet_spie_carnet_de_bord_principal.csv",
    )


@pytest.fixture
def pe_action_csv_filepath() -> str:
    return os.path.join(
        test_dir,
        "fixtures",
        "actions_example.csv",
    )


@pytest.fixture
def orientation_manager_csv_filepath() -> str:
    return os.path.join(
        test_dir,
        "fixtures",
        "import_charges_orientation.csv",
    )


@pytest.fixture
def orientation_manager_xls_filepath() -> str:
    return os.path.join(
        test_dir,
        "fixtures",
        "import_charges_orientation.xls",
    )


@pytest.fixture
def fichier_mensuel_caf() -> str:
    return os.path.join(test_dir, "fixtures", "RSABEM.xml")


@pytest.fixture
def flux_mensuel_caf() -> typing.Generator[io.BufferedReader, Any, Any]:
    file_path = os.path.join(test_dir, "fixtures", "RSABEM.xml")
    with open(file_path, "rb") as file:
        yield file


@pytest.fixture
def flux_quotidien_caf_invalid() -> typing.Generator[io.BufferedReader, Any, Any]:
    file_path = os.path.join(test_dir, "fixtures", "RSABEI_invalid.xml")
    with open(file_path, "rb") as file:
        yield file


@pytest.fixture
def orientation_manager_xlsx_filepath() -> str:
    return os.path.join(
        test_dir,
        "fixtures",
        "import_charges_orientation.xlsx",
    )


@pytest.fixture
def csv_beneficiary_filepath() -> str:
    return os.path.join(
        test_dir,
        "fixtures",
        "import_beneficiaires.csv",
    )


@pytest.fixture
def csv_beneficiary_with_all_date_formats_filepath() -> str:
    return os.path.join(
        test_dir,
        "fixtures",
        "import_beneficiaires_with_all_date_formats.csv",
    )


@pytest.fixture
def pe_principal_csv_series(pe_principal_csv_filepath) -> DataFrame:
    return dd.read_csv(  # type: ignore
        pe_principal_csv_filepath,
        sep=";",
        dtype=str,
        keep_default_na=False,
        na_values=["_"],
    )


@pytest.fixture
def pe_action_csv_series(pe_action_csv_filepath) -> DataFrame:
    return dd.read_csv(  # type: ignore
        pe_action_csv_filepath,
        sep=";",
        dtype=str,
        keep_default_na=False,
        na_values=["_"],
    )


@pytest.fixture
def csv_structure_filepath() -> str:
    return os.path.join(
        test_dir,
        "fixtures",
        "import_structures.csv",
    )


@pytest.fixture
def csv_structure_buggy_filepath() -> str:
    return os.path.join(
        test_dir,
        "fixtures",
        "import_structures_buggy.csv",
    )


@pytest.fixture
def csv_structure_missing_key_filepath() -> str:
    return os.path.join(
        test_dir,
        "fixtures",
        "import_structures_missing_key.csv",
    )


@pytest.fixture
@pytest.mark.asyncio
async def beneficiary_martin_gal(db_connection) -> Beneficiary | None:
    return await get_beneficiary_by_id(
        db_connection, UUID("1f0d3401-67ad-4ea7-8f3a-a0876c4f79bd")
    )


@pytest.fixture
@pytest.mark.asyncio
async def beneficiary_sophie_tifour(db_connection) -> Beneficiary | None:
    return await get_beneficiary_by_id(
        db_connection, UUID("c6e84ed6-eb31-47f0-bd71-9e4d7843cf0b")
    )


@pytest.fixture
@pytest.mark.asyncio
async def notebook_sophie_tifour(db_connection) -> Notebook | None:
    return await get_notebook_by_id(
        db_connection, UUID("9b07a45e-2c7c-4f92-ae6b-bc2f5a3c9a7d")
    )


@pytest.fixture
@pytest.mark.asyncio
async def notebook_craig_reilly(db_connection) -> Notebook | None:
    return await get_notebook_by_id(
        db_connection, UUID("c87a9380-6b94-409d-9e0d-14ce5c46047e")
    )


@pytest.fixture
@pytest.mark.asyncio
async def beneficiary_edwina_skinner(db_connection) -> Beneficiary | None:
    return await get_beneficiary_by_id(
        db_connection, UUID("0af66131-727b-4d47-b0d2-92d363ed145b")
    )


@pytest.fixture
@pytest.mark.asyncio
async def beneficiary_hendrix_dorsey(db_connection) -> Beneficiary | None:
    return await get_beneficiary_by_id(
        db_connection, UUID("c09d2326-c37c-40ee-8b49-71eeb67c1871")
    )


@pytest.fixture
@pytest.mark.asyncio
async def beneficiary_noel_keller(db_connection) -> Beneficiary | None:
    return await get_beneficiary_by_id(
        db_connection, UUID("ba6dc97e-05dd-4053-a810-b12605a11bba")
    )


@pytest.fixture
@pytest.mark.asyncio
async def notebook_noel_keller(db_connection) -> Notebook | None:
    return await get_notebook_by_id(
        db_connection, UUID("a89cf5f3-7013-480a-a3bf-e10ad0b6f9e8")
    )


@pytest.fixture
@pytest.mark.asyncio
async def beneficiary_jennings_dee(db_connection) -> Beneficiary | None:
    return await get_beneficiary_by_id(
        db_connection, UUID("695b2792-93ad-4819-954f-b022006bd92e")
    )


@pytest.fixture
@pytest.mark.asyncio
async def notebook_jennings_dee(db_connection) -> Notebook | None:
    return await get_notebook_by_id(
        db_connection, UUID("798d152c-c812-4708-a2dc-5582f07c71d2")
    )


@pytest.fixture
@pytest.mark.asyncio
async def orientation_request_jennings_dee(db_connection) -> OrientationRequest | None:
    return await get_orientation_request_by_id(
        db_connection, UUID("1f696530-984c-4f92-be13-c477097b02b7")
    )


@pytest.fixture
@pytest.mark.asyncio
async def professional_pierre_chevalier(db_connection) -> Professional | None:
    return await get_professional_by_email(
        db_connection, "pierre.chevalier@livry-gargan.fr"
    )


@pytest.fixture
@pytest.mark.asyncio
async def professional_paul_camara(db_connection) -> Professional | None:
    return await get_professional_by_email(db_connection, "pcamara@seinesaintdenis.fr")


@pytest.fixture
@pytest.mark.asyncio
async def professional_edith_orial(db_connection) -> Professional | None:
    return await get_professional_by_email(
        db_connection, "edith.orial@interlogement93.fr"
    )


@pytest.fixture
def beneficiary_without_account(beneficiary: Beneficiary) -> Beneficiary:
    beneficiary.account_id = None
    return beneficiary


@pytest.fixture
@pytest.mark.asyncio
async def orientation_system_pro_id() -> UUID:
    return UUID("f26ea5ba-e8a1-48ad-a031-f42d7f861008")


@pytest.fixture
@pytest.mark.asyncio
async def orientation_system_social_id() -> UUID:
    return UUID("cc92714c-db2c-4d49-a877-571ecc6138c2")


@pytest.fixture
@pytest.mark.asyncio
async def orientation_system_sociopro_id() -> UUID:
    return UUID("7ea8a071-1ef8-4747-9cd8-9e68086df0e9")


@pytest.fixture
@pytest.mark.asyncio
async def orientation_system_pe_id() -> UUID:
    return UUID("fc48d848-33bf-437a-9533-881e16ffa666")


@pytest.fixture
@pytest.mark.asyncio
async def orientation_system_ria_id() -> UUID:
    return UUID("9b44df64-1ad9-4001-97c7-1776fc878a17")


@pytest.fixture
@pytest.mark.asyncio
async def orientation_system_ria(
    db_connection, orientation_system_ria_id
) -> OrientationSystem | None:
    return await get_orientation_system_by_id(db_connection, orientation_system_ria_id)


@pytest.fixture
@pytest.mark.asyncio
async def orientation_system_pe(
    db_connection, orientation_system_pe_id
) -> OrientationSystem | None:
    return await get_orientation_system_by_id(db_connection, orientation_system_pe_id)


@pytest.fixture
@pytest.mark.asyncio
async def orientation_system_pro(
    db_connection, orientation_system_pro_id
) -> OrientationSystem | None:
    return await get_orientation_system_by_id(db_connection, orientation_system_pro_id)


@pytest.fixture(autouse=True)
@pytest.mark.asyncio
async def db_connection(seeded_db):
    async with seeded_db.pool.acquire() as connection:
        yield connection


"""
These jso token are generated using a 10y lifetime
I udpate /src/lib/utils/getJwt.ts and change the expiresIn to '10y'
then I log with a given role and copy / paste the jwt from devtools.
"""


@pytest.fixture
def get_manager_jwt_93() -> str:
    return "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJodHRwczovL2hhc3VyYS5pby9qd3QvY2xhaW1zIjp7IngtaGFzdXJhLWFsbG93ZWQtcm9sZXMiOlsibWFuYWdlciJdLCJ4LWhhc3VyYS1kZWZhdWx0LXJvbGUiOiJtYW5hZ2VyIiwieC1oYXN1cmEtdXNlci1pZCI6Ijk2Y2I2ZTA5LTgxZmEtNDRlOS05YjNmLTc1YzkzYWQ5NmY5NCIsIngtaGFzdXJhLW1hbmFnZXItaWQiOiIwMWEzZDkwNi03MGQ5LTQyZTYtOWI2MS0yY2NmMDMwZTVkOGYiLCJ4LWhhc3VyYS1kZXBsb3ltZW50LWlkIjoiNGRhYjgwMzYtYTg2ZS00ZDVmLTliZDQtNmNlODhjMTk0MGQwIn0sImlkIjoiOTZjYjZlMDktODFmYS00NGU5LTliM2YtNzVjOTNhZDk2Zjk0Iiwicm9sZSI6Im1hbmFnZXIiLCJkZXBsb3ltZW50SWQiOiI0ZGFiODAzNi1hODZlLTRkNWYtOWJkNC02Y2U4OGMxOTQwZDAiLCJtYW5hZ2VySWQiOiIwMWEzZDkwNi03MGQ5LTQyZTYtOWI2MS0yY2NmMDMwZTVkOGYiLCJpYXQiOjE2NTU5OTg0NTYsImV4cCI6MTk3MTU3NDQ1Niwic3ViIjoiOTZjYjZlMDktODFmYS00NGU5LTliM2YtNzVjOTNhZDk2Zjk0In0.a-_Be_xPJ6g26Gh9U5cGBychGk7wkiU6DmaBVOtHkOY"  # noqa: E501


@pytest.fixture
def get_manager_jwt_51() -> str:
    # manager for deployment 51
    return "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJodHRwczovL2hhc3VyYS5pby9qd3QvY2xhaW1zIjp7IngtaGFzdXJhLWFsbG93ZWQtcm9sZXMiOlsibWFuYWdlciJdLCJ4LWhhc3VyYS1kZWZhdWx0LXJvbGUiOiJtYW5hZ2VyIiwieC1oYXN1cmEtdXNlci1pZCI6IjNmNGM1ZDk1LWIyNWMtNGUxOC1hMmM2LWIzOTRiODIyMWM4ZiIsIngtaGFzdXJhLW1hbmFnZXItaWQiOiJjYzMyMTI0ZC1mODEwLTQxOTMtYTg1NS1kYjc2OTE1YWU3ZTQiLCJ4LWhhc3VyYS1kZXBsb3ltZW50LWlkIjoiYzVjM2E5MzMtNmY0YS00YjJiLWFhNDktN2E4MTZlYWVmMTZiIn0sImlkIjoiM2Y0YzVkOTUtYjI1Yy00ZTE4LWEyYzYtYjM5NGI4MjIxYzhmIiwicm9sZSI6Im1hbmFnZXIiLCJkZXBsb3ltZW50SWQiOiJjNWMzYTkzMy02ZjRhLTRiMmItYWE0OS03YTgxNmVhZWYxNmIiLCJtYW5hZ2VySWQiOiJjYzMyMTI0ZC1mODEwLTQxOTMtYTg1NS1kYjc2OTE1YWU3ZTQiLCJpYXQiOjE2Nzg3OTg0MTUsImV4cCI6MTk5NDM3NDQxNSwic3ViIjoiM2Y0YzVkOTUtYjI1Yy00ZTE4LWEyYzYtYjM5NGI4MjIxYzhmIn0.qk4cUt6_rrZQfeh8CJKx6brun1mQ3sfVNycFlQpNNTM"  # noqa: E501


@pytest.fixture
def get_admin_structure_jwt() -> str:
    return "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJodHRwczovL2hhc3VyYS5pby9qd3QvY2xhaW1zIjp7IngtaGFzdXJhLWFsbG93ZWQtcm9sZXMiOlsiYWRtaW5fc3RydWN0dXJlIl0sIngtaGFzdXJhLWRlZmF1bHQtcm9sZSI6ImFkbWluX3N0cnVjdHVyZSIsIngtaGFzdXJhLXVzZXItaWQiOiIxYTE5ZDcyYy03ZmIxLTRjZGItYWE0Ny04NTNiODMyMzljOTgiLCJ4LWhhc3VyYS1hZG1pblN0cnVjdHVyZS1pZCI6ImMyYTM0NmNkLWIzZGQtNDg5Mi1hMzNkLTdhZGE4MjY1NGY5NyIsIngtaGFzdXJhLWRlcGxveW1lbnQtaWQiOiI0ZGFiODAzNi1hODZlLTRkNWYtOWJkNC02Y2U4OGMxOTQwZDAifSwiaWQiOiIxYTE5ZDcyYy03ZmIxLTRjZGItYWE0Ny04NTNiODMyMzljOTgiLCJyb2xlIjoiYWRtaW5fc3RydWN0dXJlIiwiZGVwbG95bWVudElkIjoiNGRhYjgwMzYtYTg2ZS00ZDVmLTliZDQtNmNlODhjMTk0MGQwIiwiYWRtaW5TdHJ1Y3R1cmVJZCI6ImMyYTM0NmNkLWIzZGQtNDg5Mi1hMzNkLTdhZGE4MjY1NGY5NyIsImlhdCI6MTY1NTk5ODUyOCwiZXhwIjoxOTcxNTc0NTI4LCJzdWIiOiIxYTE5ZDcyYy03ZmIxLTRjZGItYWE0Ny04NTNiODMyMzljOTgifQ.mN6A0KVbhxE9-lMG6FGXHnDnlzx21dsnY-JMjtFLeOY"  # noqa: E501


@pytest.fixture
def get_admin_cdb_jwt() -> str:
    return "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJodHRwczovL2hhc3VyYS5pby9qd3QvY2xhaW1zIjp7IngtaGFzdXJhLWFsbG93ZWQtcm9sZXMiOlsiYWRtaW5fY2RiIl0sIngtaGFzdXJhLWRlZmF1bHQtcm9sZSI6ImFkbWluX2NkYiIsIngtaGFzdXJhLXVzZXItaWQiOiI5ZWVlOWZlYS1iZjNlLTRlYjgtOGY0My1kOWI3ZmQ2ZmFlNzYifSwiaWQiOiI5ZWVlOWZlYS1iZjNlLTRlYjgtOGY0My1kOWI3ZmQ2ZmFlNzYiLCJyb2xlIjoiYWRtaW5fY2RiIiwiaWF0IjoxNjU2OTQ4NzY0LCJleHAiOjE5NzI1MjQ3NjQsInN1YiI6IjllZWU5ZmVhLWJmM2UtNGViOC04ZjQzLWQ5YjdmZDZmYWU3NiJ9.pOA5uQoIWlmkxETNBoLUf7oidru06EBNz_O74yGi-OQ"  # noqa: E501


@pytest.fixture
def get_professional_jwt() -> str:
    return "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJodHRwczovL2hhc3VyYS5pby9qd3QvY2xhaW1zIjp7IngtaGFzdXJhLWFsbG93ZWQtcm9sZXMiOlsicHJvZmVzc2lvbmFsIl0sIngtaGFzdXJhLWRlZmF1bHQtcm9sZSI6InByb2Zlc3Npb25hbCIsIngtaGFzdXJhLXVzZXItaWQiOiJkMGI4ZjMxNC01ZTgzLTQ1MzUtOTM2MC02MGYyOWRjZmI1YzgiLCJ4LWhhc3VyYS1wcm9mZXNzaW9uYWwtaWQiOiJlMWZkYjdhOC03ZDBlLTRiMmUtYjI4Yy04OWE2NjJkMDkwYTMiLCJ4LWhhc3VyYS1kZXBsb3ltZW50LWlkIjoiNGRhYjgwMzYtYTg2ZS00ZDVmLTliZDQtNmNlODhjMTk0MGQwIiwieC1oYXN1cmEtc3RydWN0dXJlLWlkIjoiZTU3ODIzN2YtNjE2Ny00MDEyLWI0NTctN2M0ZjM2ZmIwNzlkIn0sImlkIjoiZDBiOGYzMTQtNWU4My00NTM1LTkzNjAtNjBmMjlkY2ZiNWM4Iiwicm9sZSI6InByb2Zlc3Npb25hbCIsInByb2Zlc3Npb25hbElkIjoiZTFmZGI3YTgtN2QwZS00YjJlLWIyOGMtODlhNjYyZDA5MGEzIiwiZGVwbG95bWVudElkIjoiNGRhYjgwMzYtYTg2ZS00ZDVmLTliZDQtNmNlODhjMTk0MGQwIiwic3RydWN0dXJlSWQiOiJlNTc4MjM3Zi02MTY3LTQwMTItYjQ1Ny03YzRmMzZmYjA3OWQiLCJpYXQiOjE2NzI2ODg4NzUsImV4cCI6MTk4ODI2NDg3NSwic3ViIjoiZDBiOGYzMTQtNWU4My00NTM1LTkzNjAtNjBmMjlkY2ZiNWM4In0.YwgW4X_mxj9qyJnVCplffuIq9Zjsumrt5eUK26YLYIM"  # noqa: E501


@pytest.fixture
def get_professional_jwt_without_structure_id() -> str:
    return "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJodHRwczovL2hhc3VyYS5pby9qd3QvY2xhaW1zIjp7IngtaGFzdXJhLWFsbG93ZWQtcm9sZXMiOlsicHJvZmVzc2lvbmFsIl0sIngtaGFzdXJhLWRlZmF1bHQtcm9sZSI6InByb2Zlc3Npb25hbCIsIngtaGFzdXJhLXVzZXItaWQiOiIxNzQzNDQ2NC01ZjY5LTQwY2MtODE3Mi00MDE2MDk1OGEzM2QiLCJ4LWhhc3VyYS1wcm9mZXNzaW9uYWwtaWQiOiIxYTViODE3Yi02YjgxLTRhNGQtOTk1My0yNjcwN2E1NGUwZTkiLCJ4LWhhc3VyYS1kZXBsb3ltZW50LWlkIjoiNGRhYjgwMzYtYTg2ZS00ZDVmLTliZDQtNmNlODhjMTk0MGQwIn0sImlkIjoiMTc0MzQ0NjQtNWY2OS00MGNjLTgxNzItNDAxNjA5NThhMzNkIiwicm9sZSI6InByb2Zlc3Npb25hbCIsInByb2Zlc3Npb25hbElkIjoiMWE1YjgxN2ItNmI4MS00YTRkLTk5NTMtMjY3MDdhNTRlMGU5IiwiZGVwbG95bWVudElkIjoiNGRhYjgwMzYtYTg2ZS00ZDVmLTliZDQtNmNlODhjMTk0MGQwIiwiaWF0IjoxNjYxODY2NzkzLCJleHAiOjE5Nzc0NDI3OTMsInN1YiI6IjE3NDM0NDY0LTVmNjktNDBjYy04MTcyLTQwMTYwOTU4YTMzZCJ9.sSj94JD2BvBjjUttMhfNQnVwvj6vOWnKW3Vkkbsskxs"  # noqa: E501


@pytest.fixture
def giulia_diaby_jwt() -> str:
    return "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJodHRwczovL2hhc3VyYS5pby9qd3QvY2xhaW1zIjp7IngtaGFzdXJhLWFsbG93ZWQtcm9sZXMiOlsib3JpZW50YXRpb25fbWFuYWdlciJdLCJ4LWhhc3VyYS1kZWZhdWx0LXJvbGUiOiJvcmllbnRhdGlvbl9tYW5hZ2VyIiwieC1oYXN1cmEtdXNlci1pZCI6IjJhZGRkMTBmLTliZDMtNGQzNy1iM2M5LTEwYTZlMmM0YmU0ZiIsIngtaGFzdXJhLW9yaWVudGF0aW9uTWFuYWdlci1pZCI6IjYwN2NiNmY4LTllMzMtNGNlOC05OGIxLTM4ZTYwYzlkZGE5OSIsIngtaGFzdXJhLWRlcGxveW1lbnQtaWQiOiI0ZGFiODAzNi1hODZlLTRkNWYtOWJkNC02Y2U4OGMxOTQwZDAifSwiaWQiOiIyYWRkZDEwZi05YmQzLTRkMzctYjNjOS0xMGE2ZTJjNGJlNGYiLCJyb2xlIjoib3JpZW50YXRpb25fbWFuYWdlciIsImRlcGxveW1lbnRJZCI6IjRkYWI4MDM2LWE4NmUtNGQ1Zi05YmQ0LTZjZTg4YzE5NDBkMCIsIm9yaWVudGF0aW9uTWFuYWdlcklkIjoiNjA3Y2I2ZjgtOWUzMy00Y2U4LTk4YjEtMzhlNjBjOWRkYTk5IiwiaWF0IjoxNjY5MzAyNzYxLCJleHAiOjE5ODQ4Nzg3NjEsInN1YiI6IjJhZGRkMTBmLTliZDMtNGQzNy1iM2M5LTEwYTZlMmM0YmU0ZiJ9.X-4PFqGMLszH2_x1wSUkV-cME0Ln1WljeSMnyQ1LJA0"  # noqa: E501


@pytest.fixture
def samy_rouate_jwt() -> str:
    return "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJodHRwczovL2hhc3VyYS5pby9qd3QvY2xhaW1zIjp7IngtaGFzdXJhLWFsbG93ZWQtcm9sZXMiOlsib3JpZW50YXRpb25fbWFuYWdlciJdLCJ4LWhhc3VyYS1kZWZhdWx0LXJvbGUiOiJvcmllbnRhdGlvbl9tYW5hZ2VyIiwieC1oYXN1cmEtdXNlci1pZCI6IjIzZTkxMGE2LTBiM2QtNDE0Ny1hYzZmLTllZmJjZWNhYWI3MCIsIngtaGFzdXJhLW9yaWVudGF0aW9uTWFuYWdlci1pZCI6IjNmODJmYzIyLTEyZjAtNGMwYi04NWQ1LTU3YWUwNTRhMmVlMyIsIngtaGFzdXJhLWRlcGxveW1lbnQtaWQiOiI0ZGFiODAzNi1hODZlLTRkNWYtOWJkNC02Y2U4OGMxOTQwZDAifSwiaWQiOiIyM2U5MTBhNi0wYjNkLTQxNDctYWM2Zi05ZWZiY2VjYWFiNzAiLCJyb2xlIjoib3JpZW50YXRpb25fbWFuYWdlciIsImRlcGxveW1lbnRJZCI6IjRkYWI4MDM2LWE4NmUtNGQ1Zi05YmQ0LTZjZTg4YzE5NDBkMCIsIm9yaWVudGF0aW9uTWFuYWdlcklkIjoiM2Y4MmZjMjItMTJmMC00YzBiLTg1ZDUtNTdhZTA1NGEyZWUzIiwiaWF0IjoxNjczNTM0MzQ4LCJleHAiOjE5ODkxMTAzNDgsInN1YiI6IjIzZTkxMGE2LTBiM2QtNDE0Ny1hYzZmLTllZmJjZWNhYWI3MCJ9.KRSE4ZjNB-S3U55gmKBUdUeFUVKJO5vNpHigIvsLOkA"  # noqa: E501


@pytest.fixture
def laure_loge_jwt() -> str:
    return "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJodHRwczovL2hhc3VyYS5pby9qd3QvY2xhaW1zIjp7IngtaGFzdXJhLWFsbG93ZWQtcm9sZXMiOlsib3JpZW50YXRpb25fbWFuYWdlciJdLCJ4LWhhc3VyYS1kZWZhdWx0LXJvbGUiOiJvcmllbnRhdGlvbl9tYW5hZ2VyIiwieC1oYXN1cmEtdXNlci1pZCI6ImYyOWNhNzhhLTQ3MTktNDY1OC04ZDE5LTQ4ZDNkZjkxNzhiNSIsIngtaGFzdXJhLW9yaWVudGF0aW9uTWFuYWdlci1pZCI6IjNkYmI2MTBlLTkxNmYtNDllMC04ODYwLWI1ZGMzOWRlY2Q0OSIsIngtaGFzdXJhLWRlcGxveW1lbnQtaWQiOiJjNWMzYTkzMy02ZjRhLTRiMmItYWE0OS03YTgxNmVhZWYxNmIifSwiaWQiOiJmMjljYTc4YS00NzE5LTQ2NTgtOGQxOS00OGQzZGY5MTc4YjUiLCJyb2xlIjoib3JpZW50YXRpb25fbWFuYWdlciIsImRlcGxveW1lbnRJZCI6ImM1YzNhOTMzLTZmNGEtNGIyYi1hYTQ5LTdhODE2ZWFlZjE2YiIsIm9yaWVudGF0aW9uTWFuYWdlcklkIjoiM2RiYjYxMGUtOTE2Zi00OWUwLTg4NjAtYjVkYzM5ZGVjZDQ5IiwiaWF0IjoxNjc4ODE0MzE3LCJleHAiOjE5OTQzOTAzMTcsInN1YiI6ImYyOWNhNzhhLTQ3MTktNDY1OC04ZDE5LTQ4ZDNkZjkxNzhiNSJ9.U5sQhkKUtBaYCLJivu6iHvRaMghf5Lr7geu7p8tvWi8"  # noqa: E501


@pytest.fixture
def get_professional_paul_camara_jwt() -> str:
    return "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJodHRwczovL2hhc3VyYS5pby9qd3QvY2xhaW1zIjp7IngtaGFzdXJhLWFsbG93ZWQtcm9sZXMiOlsicHJvZmVzc2lvbmFsIl0sIngtaGFzdXJhLWRlZmF1bHQtcm9sZSI6InByb2Zlc3Npb25hbCIsIngtaGFzdXJhLXVzZXItaWQiOiJkMGI4ZjMxNC01ZTgzLTQ1MzUtOTM2MC02MGYyOWRjZmI1YzgiLCJ4LWhhc3VyYS1wcm9mZXNzaW9uYWwtaWQiOiJlMWZkYjdhOC03ZDBlLTRiMmUtYjI4Yy04OWE2NjJkMDkwYTMiLCJ4LWhhc3VyYS1kZXBsb3ltZW50LWlkIjoiNGRhYjgwMzYtYTg2ZS00ZDVmLTliZDQtNmNlODhjMTk0MGQwIiwieC1oYXN1cmEtc3RydWN0dXJlLWlkIjoiZTU3ODIzN2YtNjE2Ny00MDEyLWI0NTctN2M0ZjM2ZmIwNzlkIn0sImlkIjoiZDBiOGYzMTQtNWU4My00NTM1LTkzNjAtNjBmMjlkY2ZiNWM4Iiwicm9sZSI6InByb2Zlc3Npb25hbCIsInByb2Zlc3Npb25hbElkIjoiZTFmZGI3YTgtN2QwZS00YjJlLWIyOGMtODlhNjYyZDA5MGEzIiwiZGVwbG95bWVudElkIjoiNGRhYjgwMzYtYTg2ZS00ZDVmLTliZDQtNmNlODhjMTk0MGQwIiwic3RydWN0dXJlSWQiOiJlNTc4MjM3Zi02MTY3LTQwMTItYjQ1Ny03YzRmMzZmYjA3OWQiLCJpYXQiOjE2NzI2ODg4NzUsImV4cCI6MTk4ODI2NDg3NSwic3ViIjoiZDBiOGYzMTQtNWU4My00NTM1LTkzNjAtNjBmMjlkY2ZiNWM4In0.YwgW4X_mxj9qyJnVCplffuIq9Zjsumrt5eUK26YLYIM"  # noqa: E501


@pytest.fixture
def import_structures_json() -> list[dict]:
    return [
        {
            "name": "ins'Hair",
            "short_desc": "l'insertion par la coiffure",
            "postal_code": "93001",
            "city": "Livry Gargan",
            "admin_email": "admin@inshair.fr",
        },
    ]


@pytest.fixture
def import_structures_json_with_errors() -> list[dict]:
    return [
        {
            "name": "ins'Hair",
            "short_desc": "l'insertion par la coiffure",
            "postal_code": "93001",
            "city": "Livry Gargan",
            "admin_email": "admin@inshair.fr",
        },
        {
            "name": "test",
            "postal_code": "93001",
            "admin_email": "admin@test93.fr",
        },
    ]


@pytest.fixture
def deployment_id_cd93() -> UUID:
    return UUID("4dab8036-a86e-4d5f-9bd4-6ce88c1940d0")


@pytest.fixture
def structure_id_pe_livry() -> UUID:
    return UUID("a81bc81b-dead-4e5d-abff-90865d1e13b2")


@pytest.fixture
@pytest.mark.asyncio
async def beneficiary_import_alain_die() -> BeneficiaryImport:
    return BeneficiaryImport(
        internal_id="1234",
        firstname="Alain",
        lastname="Die",
        date_of_birth="1980-01-01",
        place_of_birth="Lyon",
        mobile_number="0601020304",
        email="alain.die@lycos.com",
        address1="Rue",
        postal_code="69900",
        city="Lyon",
        work_situation="iae",
        right_rsa="rsa_droit_ouvert_versable",
        right_ass=True,
    )
