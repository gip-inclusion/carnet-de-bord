import asyncio
import os
from uuid import UUID

import dask.dataframe as dd
import pytest
from dask.dataframe.core import DataFrame
from fastapi.testclient import TestClient

from api.core.db import get_connection_pool
from api.core.init import create_app
from api.core.settings import settings
from api.db.crud.beneficiary import get_beneficiary_by_id
from api.db.crud.notebook import get_notebook_by_id
from api.db.crud.orientation_request import get_orientation_request_by_id
from api.db.crud.professional import get_professional_by_email
from api.db.models.beneficiary import Beneficiary, BeneficiaryImport
from api.db.models.notebook import Notebook
from api.db.models.orientation_request import OrientationRequest
from api.db.models.professional import Professional

test_dir = os.path.dirname(os.path.realpath(__file__))


@pytest.fixture
def seed_filepath() -> str:
    return os.path.join(
        test_dir, "..", "..", "hasura", "seeds", "carnet_de_bord", "seed-data.sql"
    )


@pytest.fixture
def test_directory() -> str:
    return test_dir


@pytest.fixture
@pytest.mark.asyncio
async def fastapi_app(seed_filepath: str):
    # @TODO: read it from the root .env file
    settings.database_url = os.getenv(
        "DATABASE_URL", "postgres://cdb:test@localhost:5433/carnet_de_bord"
    )
    app = create_app()
    await app.state.db.create_pool()
    async with app.state.db.pool.acquire() as connection:
        with open(seed_filepath, "r", encoding="UTF-8") as file:
            data = file.read()
            await connection.execute(data)

    yield app
    # Do cleaning stuff if needed


@pytest.fixture
@pytest.mark.asyncio
async def test_client(fastapi_app):

    with TestClient(fastapi_app) as c:
        yield c


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
async def db_connection(db_pool, seed_filepath):
    # Take a connection from the pool.
    if db_pool:

        async with db_pool.acquire() as connection:
            # Load the seeds

            with open(seed_filepath, "r") as file:
                data = file.read()
                await connection.execute(data)

            yield connection


@pytest.fixture
@pytest.mark.asyncio
async def db_pool():
    yield await get_connection_pool(
        os.getenv(
            "DATABASE_URL",
            # You can't name your test database as you want. It has to be
            # carnet_de_bord otherwise you will not be able to apply
            # migrations with hasura
            "postgres://cdb:test@localhost:5433/carnet_de_bord",
        )
    )


@pytest.fixture
def event_loop():
    # See https://github.com/pytest-dev/pytest-asyncio/pull/214/files
    # https://github.com/MagicStack/asyncpg/issues/293
    return asyncio.get_event_loop_policy().get_event_loop()
    # return asyncio.get_event_loop()


"""
These jso token are generated using a 10y lifetime
I udpate /src/lib/utils/getJwt.ts and change the expiresIn to '10y'
then I log with a given role and copy / paste the jwt from devtools.
"""


@pytest.fixture
def get_manager_jwt() -> str:
    return "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJodHRwczovL2hhc3VyYS5pby9qd3QvY2xhaW1zIjp7IngtaGFzdXJhLWFsbG93ZWQtcm9sZXMiOlsibWFuYWdlciJdLCJ4LWhhc3VyYS1kZWZhdWx0LXJvbGUiOiJtYW5hZ2VyIiwieC1oYXN1cmEtdXNlci1pZCI6Ijk2Y2I2ZTA5LTgxZmEtNDRlOS05YjNmLTc1YzkzYWQ5NmY5NCIsIngtaGFzdXJhLW1hbmFnZXItaWQiOiIwMWEzZDkwNi03MGQ5LTQyZTYtOWI2MS0yY2NmMDMwZTVkOGYiLCJ4LWhhc3VyYS1kZXBsb3ltZW50LWlkIjoiNGRhYjgwMzYtYTg2ZS00ZDVmLTliZDQtNmNlODhjMTk0MGQwIn0sImlkIjoiOTZjYjZlMDktODFmYS00NGU5LTliM2YtNzVjOTNhZDk2Zjk0Iiwicm9sZSI6Im1hbmFnZXIiLCJkZXBsb3ltZW50SWQiOiI0ZGFiODAzNi1hODZlLTRkNWYtOWJkNC02Y2U4OGMxOTQwZDAiLCJtYW5hZ2VySWQiOiIwMWEzZDkwNi03MGQ5LTQyZTYtOWI2MS0yY2NmMDMwZTVkOGYiLCJpYXQiOjE2NTU5OTg0NTYsImV4cCI6MTk3MTU3NDQ1Niwic3ViIjoiOTZjYjZlMDktODFmYS00NGU5LTliM2YtNzVjOTNhZDk2Zjk0In0.a-_Be_xPJ6g26Gh9U5cGBychGk7wkiU6DmaBVOtHkOY"


@pytest.fixture
def get_admin_structure_jwt() -> str:
    return "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJodHRwczovL2hhc3VyYS5pby9qd3QvY2xhaW1zIjp7IngtaGFzdXJhLWFsbG93ZWQtcm9sZXMiOlsiYWRtaW5fc3RydWN0dXJlIl0sIngtaGFzdXJhLWRlZmF1bHQtcm9sZSI6ImFkbWluX3N0cnVjdHVyZSIsIngtaGFzdXJhLXVzZXItaWQiOiIxYTE5ZDcyYy03ZmIxLTRjZGItYWE0Ny04NTNiODMyMzljOTgiLCJ4LWhhc3VyYS1hZG1pblN0cnVjdHVyZS1pZCI6ImMyYTM0NmNkLWIzZGQtNDg5Mi1hMzNkLTdhZGE4MjY1NGY5NyIsIngtaGFzdXJhLWRlcGxveW1lbnQtaWQiOiI0ZGFiODAzNi1hODZlLTRkNWYtOWJkNC02Y2U4OGMxOTQwZDAifSwiaWQiOiIxYTE5ZDcyYy03ZmIxLTRjZGItYWE0Ny04NTNiODMyMzljOTgiLCJyb2xlIjoiYWRtaW5fc3RydWN0dXJlIiwiZGVwbG95bWVudElkIjoiNGRhYjgwMzYtYTg2ZS00ZDVmLTliZDQtNmNlODhjMTk0MGQwIiwiYWRtaW5TdHJ1Y3R1cmVJZCI6ImMyYTM0NmNkLWIzZGQtNDg5Mi1hMzNkLTdhZGE4MjY1NGY5NyIsImlhdCI6MTY1NTk5ODUyOCwiZXhwIjoxOTcxNTc0NTI4LCJzdWIiOiIxYTE5ZDcyYy03ZmIxLTRjZGItYWE0Ny04NTNiODMyMzljOTgifQ.mN6A0KVbhxE9-lMG6FGXHnDnlzx21dsnY-JMjtFLeOY"


@pytest.fixture
def get_admin_cdb_jwt() -> str:
    return "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJodHRwczovL2hhc3VyYS5pby9qd3QvY2xhaW1zIjp7IngtaGFzdXJhLWFsbG93ZWQtcm9sZXMiOlsiYWRtaW5fY2RiIl0sIngtaGFzdXJhLWRlZmF1bHQtcm9sZSI6ImFkbWluX2NkYiIsIngtaGFzdXJhLXVzZXItaWQiOiI5ZWVlOWZlYS1iZjNlLTRlYjgtOGY0My1kOWI3ZmQ2ZmFlNzYifSwiaWQiOiI5ZWVlOWZlYS1iZjNlLTRlYjgtOGY0My1kOWI3ZmQ2ZmFlNzYiLCJyb2xlIjoiYWRtaW5fY2RiIiwiaWF0IjoxNjU2OTQ4NzY0LCJleHAiOjE5NzI1MjQ3NjQsInN1YiI6IjllZWU5ZmVhLWJmM2UtNGViOC04ZjQzLWQ5YjdmZDZmYWU3NiJ9.pOA5uQoIWlmkxETNBoLUf7oidru06EBNz_O74yGi-OQ"


@pytest.fixture
def get_professional_jwt() -> str:
    return "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJodHRwczovL2hhc3VyYS5pby9qd3QvY2xhaW1zIjp7IngtaGFzdXJhLWFsbG93ZWQtcm9sZXMiOlsicHJvZmVzc2lvbmFsIl0sIngtaGFzdXJhLWRlZmF1bHQtcm9sZSI6InByb2Zlc3Npb25hbCIsIngtaGFzdXJhLXVzZXItaWQiOiIxNzQzNDQ2NC01ZjY5LTQwY2MtODE3Mi00MDE2MDk1OGEzM2QiLCJ4LWhhc3VyYS1wcm9mZXNzaW9uYWwtaWQiOiIxYTViODE3Yi02YjgxLTRhNGQtOTk1My0yNjcwN2E1NGUwZTkiLCJ4LWhhc3VyYS1kZXBsb3ltZW50LWlkIjoiNGRhYjgwMzYtYTg2ZS00ZDVmLTliZDQtNmNlODhjMTk0MGQwIn0sImlkIjoiMTc0MzQ0NjQtNWY2OS00MGNjLTgxNzItNDAxNjA5NThhMzNkIiwicm9sZSI6InByb2Zlc3Npb25hbCIsInByb2Zlc3Npb25hbElkIjoiMWE1YjgxN2ItNmI4MS00YTRkLTk5NTMtMjY3MDdhNTRlMGU5IiwiZGVwbG95bWVudElkIjoiNGRhYjgwMzYtYTg2ZS00ZDVmLTliZDQtNmNlODhjMTk0MGQwIiwiaWF0IjoxNjYxODY2NzkzLCJleHAiOjE5Nzc0NDI3OTMsInN1YiI6IjE3NDM0NDY0LTVmNjktNDBjYy04MTcyLTQwMTYwOTU4YTMzZCJ9.sSj94JD2BvBjjUttMhfNQnVwvj6vOWnKW3Vkkbsskxs"


@pytest.fixture
def giulia_diaby_jwt() -> str:
    return "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJodHRwczovL2hhc3VyYS5pby9qd3QvY2xhaW1zIjp7IngtaGFzdXJhLWFsbG93ZWQtcm9sZXMiOlsib3JpZW50YXRpb25fbWFuYWdlciJdLCJ4LWhhc3VyYS1kZWZhdWx0LXJvbGUiOiJvcmllbnRhdGlvbl9tYW5hZ2VyIiwieC1oYXN1cmEtdXNlci1pZCI6IjJhZGRkMTBmLTliZDMtNGQzNy1iM2M5LTEwYTZlMmM0YmU0ZiIsIngtaGFzdXJhLW9yaWVudGF0aW9uTWFuYWdlci1pZCI6IjYwN2NiNmY4LTllMzMtNGNlOC05OGIxLTM4ZTYwYzlkZGE5OSIsIngtaGFzdXJhLWRlcGxveW1lbnQtaWQiOiI0ZGFiODAzNi1hODZlLTRkNWYtOWJkNC02Y2U4OGMxOTQwZDAifSwiaWQiOiIyYWRkZDEwZi05YmQzLTRkMzctYjNjOS0xMGE2ZTJjNGJlNGYiLCJyb2xlIjoib3JpZW50YXRpb25fbWFuYWdlciIsImRlcGxveW1lbnRJZCI6IjRkYWI4MDM2LWE4NmUtNGQ1Zi05YmQ0LTZjZTg4YzE5NDBkMCIsIm9yaWVudGF0aW9uTWFuYWdlcklkIjoiNjA3Y2I2ZjgtOWUzMy00Y2U4LTk4YjEtMzhlNjBjOWRkYTk5IiwiaWF0IjoxNjY5MzAyNzYxLCJleHAiOjE5ODQ4Nzg3NjEsInN1YiI6IjJhZGRkMTBmLTliZDMtNGQzNy1iM2M5LTEwYTZlMmM0YmU0ZiJ9.X-4PFqGMLszH2_x1wSUkV-cME0Ln1WljeSMnyQ1LJA0"


@pytest.fixture
def get_professional_paul_camara_jwt() -> str:
    return "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJodHRwczovL2hhc3VyYS5pby9qd3QvY2xhaW1zIjp7IngtaGFzdXJhLWFsbG93ZWQtcm9sZXMiOlsicHJvZmVzc2lvbmFsIl0sIngtaGFzdXJhLWRlZmF1bHQtcm9sZSI6InByb2Zlc3Npb25hbCIsIngtaGFzdXJhLXVzZXItaWQiOiJkMGI4ZjMxNC01ZTgzLTQ1MzUtOTM2MC02MGYyOWRjZmI1YzgiLCJ4LWhhc3VyYS1wcm9mZXNzaW9uYWwtaWQiOiJlMWZkYjdhOC03ZDBlLTRiMmUtYjI4Yy04OWE2NjJkMDkwYTMiLCJ4LWhhc3VyYS1kZXBsb3ltZW50LWlkIjoiNGRhYjgwMzYtYTg2ZS00ZDVmLTliZDQtNmNlODhjMTk0MGQwIn0sImlkIjoiZDBiOGYzMTQtNWU4My00NTM1LTkzNjAtNjBmMjlkY2ZiNWM4Iiwicm9sZSI6InByb2Zlc3Npb25hbCIsInByb2Zlc3Npb25hbElkIjoiZTFmZGI3YTgtN2QwZS00YjJlLWIyOGMtODlhNjYyZDA5MGEzIiwiZGVwbG95bWVudElkIjoiNGRhYjgwMzYtYTg2ZS00ZDVmLTliZDQtNmNlODhjMTk0MGQwIiwiaWF0IjoxNjcxNTcyOTg3LCJleHAiOjE5ODcxNDg5ODcsInN1YiI6ImQwYjhmMzE0LTVlODMtNDUzNS05MzYwLTYwZjI5ZGNmYjVjOCJ9.jWtuU8yKVVAqccIMdfpkdxhWyqRrNLYBkbGOqbI-58w"


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
        geographical_area="between_20_30",
    )
