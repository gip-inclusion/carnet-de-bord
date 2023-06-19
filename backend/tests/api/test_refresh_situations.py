from datetime import datetime, timedelta, timezone
from unittest import mock
from urllib.parse import quote
from uuid import UUID

import httpx
import pytest
import respx
from asyncpg import Connection, Record
from gql import gql

from cdb.api.core.settings import Settings, settings
from cdb.api.db.crud.external_data import (
    insert_external_data,
    insert_external_data_info,
)
from cdb.api.db.graphql import get_client
from cdb.api.db.models.beneficiary import Beneficiary
from cdb.api.db.models.external_data import (
    ExternalDataInfoInsert,
    ExternalDataInsert,
    ExternalSource,
)
from cdb.api.db.models.notebook import Notebook
from tests.mocks.pole_emploi_diagnostic import (
    PE_API_RECHERCHE_USAGERS_RESULT_OK_MOCK,
)
from tests.utils.approvaltests import verify_as_json

pytestmark = pytest.mark.graphql


@pytest.fixture
async def pe_settings():
    settings.PE_CLIENT_SECRET = "pe_client_secret"
    settings.PE_CLIENT_ID = "pe_client_id"

    yield settings


async def test_produces_a_401_when_the_token_is_missing(
    test_client: httpx.AsyncClient,
    beneficiary_sophie_tifour: Beneficiary,
):
    response = await test_client.post(
        "/v1/notebooks/refresh-situations-from-pole-emploi",
        json=build_payload(notebook_id=beneficiary_sophie_tifour.notebook.id),
    )
    assert response.status_code == 401
    json = response.json()
    assert json["detail"] == "Missing credentials"


@pytest.mark.graphql
@respx.mock
async def test_nominal(
    test_client: httpx.AsyncClient,
    beneficiary_sophie_tifour: Beneficiary,
    notebook_sophie_tifour: Notebook,
    sophie_tifour_contraintes: dict,
    pe_settings,
):
    mock_pe_api(
        settings,
        beneficiary_sophie_tifour,
        sophie_tifour_contraintes,
    )

    response = await call_refresh_api(beneficiary_sophie_tifour, test_client)

    expect_data_to_have_been_refreshed(True, response)

    situations = await get_notebook_situations_by_id(notebook_sophie_tifour.id)
    assert situations

    assert [
        (
            situation["refSituation"]["description"],
            situation["createdAt"].split("T")[0],
        )
        for situation in situations
    ] == [
        ("Doit quitter le logement", "2023-05-12"),
        ("Hébergé chez un tiers", "2021-09-21"),
    ]


@pytest.mark.graphql
@respx.mock
async def test_refreshes_on_new_data_from_pe(
    test_client: httpx.AsyncClient,
    beneficiary_sophie_tifour: Beneficiary,
    sophie_tifour_add_only_contraintes: dict,
    pe_settings,
):
    mock_pe_api(
        pe_settings,
        beneficiary_sophie_tifour,
        sophie_tifour_add_only_contraintes,
    )

    response = await call_refresh_api(beneficiary_sophie_tifour, test_client)

    expect_data_to_have_been_refreshed(True, response)


@pytest.mark.graphql
@respx.mock
@mock.patch("cdb.api.v1.routers.refresh_situations.call_pe")
async def test_gets_data_from_pe_when_its_missing(
    call_pe: mock.MagicMock,
    test_client: httpx.AsyncClient,
    beneficiary_sophie_tifour: Beneficiary,
):
    given_pe_data_is_different(True, call_pe)

    response = await call_refresh_api(beneficiary_sophie_tifour, test_client)

    expect_data_to_have_been_refreshed(True, response)


@pytest.mark.graphql
@respx.mock
@mock.patch("cdb.api.v1.routers.refresh_situations.call_pe")
async def test_does_nothing_when_pe_data_are_fresh(
    call_pe: mock.MagicMock,
    test_client: httpx.AsyncClient,
    beneficiary_sophie_tifour: Beneficiary,
    db_connection: Connection,
):
    external_data = await insert_external_data(
        db_connection,
        ExternalDataInsert(data={}, hash="hash", source=ExternalSource.PE_IO),
    )
    assert external_data
    await insert_external_data_info(
        db_connection,
        ExternalDataInfoInsert(
            external_data_id=external_data.id,
            beneficiary_id=beneficiary_sophie_tifour.id,
            created_at=datetime.now(tz=timezone.utc) - timedelta(minutes=59),
        ),
    )

    response = await call_refresh_api(beneficiary_sophie_tifour, test_client)

    assert call_pe.assert_not_called

    expect_data_to_have_been_refreshed(False, response)


@pytest.mark.graphql
@mock.patch("cdb.api.v1.routers.refresh_situations.call_pe")
async def test_refreshes_data_from_pe_when_they_have_expired(
    call_pe: mock.MagicMock,
    test_client: httpx.AsyncClient,
    beneficiary_sophie_tifour: Beneficiary,
    db_connection: Connection,
):
    given_pe_data_is_different(True, call_pe)
    await given_beneficiary_has_external_data_at_dates(
        [expired_date()], beneficiary_sophie_tifour, db_connection
    )

    response = await call_refresh_api(beneficiary_sophie_tifour, test_client)

    expect_data_to_have_been_refreshed(True, response)


@pytest.mark.graphql
@mock.patch("cdb.api.v1.routers.refresh_situations.call_pe")
async def test_does_nothing_when_at_least_one_data_is_fresh(
    call_pe: mock.MagicMock,
    test_client: httpx.AsyncClient,
    beneficiary_sophie_tifour: Beneficiary,
    db_connection: Connection,
):
    given_pe_data_is_different(True, call_pe)
    await given_beneficiary_has_external_data_at_dates(
        [fresh_creation_date(), expired_date()],
        beneficiary_sophie_tifour,
        db_connection,
    )

    response = await call_refresh_api(beneficiary_sophie_tifour, test_client)

    expect_data_to_have_been_refreshed(False, response)


@pytest.mark.graphql
@respx.mock
@mock.patch("cdb.api.v1.routers.refresh_situations.call_pe")
async def test_does_nothing_when_feature_is_disabled(
    call_pe: mock.MagicMock,
    test_client: httpx.AsyncClient,
    beneficiary_sophie_tifour: Beneficiary,
):
    settings.ENABLE_SITUATION_API = False

    response = await call_refresh_api(beneficiary_sophie_tifour, test_client)

    assert call_pe.assert_not_called
    expect_data_to_have_been_refreshed(False, response)

    settings.ENABLE_SITUATION_API = True


@pytest.mark.graphql
@respx.mock
async def test_saves_the_new_contraintes_into_external_data(
    test_client: httpx.AsyncClient,
    beneficiary_sophie_tifour: Beneficiary,
    sophie_tifour_add_only_contraintes: dict,
    db_connection: Connection,
    pe_settings,
):
    mock_pe_api(
        pe_settings, beneficiary_sophie_tifour, sophie_tifour_add_only_contraintes
    )
    await given_beneficiary_has_external_data_at_dates(
        [], beneficiary_sophie_tifour, db_connection
    )

    response = await call_refresh_api(beneficiary_sophie_tifour, test_client)

    record: Record = await get_last_saved_external_data(
        beneficiary_sophie_tifour.id, ExternalSource.PE_IO, db_connection
    )
    verify_as_json(
        {
            "data": record["data"],
            "source": record["source"],
            "hash": record["hash"],
        }
    )
    expect_data_to_have_been_refreshed(True, response)


@pytest.mark.graphql
@respx.mock
async def test_saves_the_new_contraintes_into_external_data_only_when_changed(
    test_client: httpx.AsyncClient,
    beneficiary_sophie_tifour: Beneficiary,
    notebook_sophie_tifour: Notebook,
    sophie_tifour_contraintes: dict,
    situation_id_contrainte_horaire: UUID,
    db_connection: Connection,
    pe_settings,
):
    mock_pe_api(pe_settings, beneficiary_sophie_tifour, sophie_tifour_contraintes)
    before = expired_date()

    await call_refresh_api(beneficiary_sophie_tifour, test_client)
    # update created_at so it happened in the past
    await update_external_data_created_at(
        beneficiary_sophie_tifour.id, before, db_connection
    )
    # add a new situation locally so there will be some differences in situations
    await add_situation_to_notebook(
        notebook_sophie_tifour.id, situation_id_contrainte_horaire, db_connection
    )

    response = await call_refresh_api(beneficiary_sophie_tifour, test_client)

    result = await get_last_saved_external_data(
        beneficiary_sophie_tifour.id, ExternalSource.PE_IO, db_connection
    )
    assert result["created_at"] == before
    expect_data_to_have_been_refreshed(False, response)


async def get_last_saved_external_data(
    beneficiary__id: UUID, source: ExternalSource, db_connection
) -> Record:
    result = await db_connection.fetchrow(
        """
        SELECT data, source, hash, edi.created_at
        FROM external_data
        LEFT JOIN external_data_info edi ON external_data_id = id
        WHERE beneficiary_id = $1 AND source = $2
        ORDER BY edi.created_at DESC
        """,
        beneficiary__id,
        source,
    )
    return result


async def update_external_data_created_at(
    beneficiary_id: UUID, created_at: datetime, db_connection
):
    await db_connection.fetchrow(
        """
        UPDATE external_data_info set created_at=$1
        WHERE beneficiary_id = $2
        """,
        created_at,
        beneficiary_id,
    )


async def add_situation_to_notebook(
    notebook_id: UUID, situation_id: UUID, db_connection
):
    await db_connection.fetchrow(
        """
        INSERT INTO notebook_situation(notebook_id, situation_id) VALUES($1, $2);
        """,
        notebook_id,
        situation_id,
    )


@pytest.mark.graphql
@respx.mock
async def test_does_nothing_when_data_from_pe_match_our_situations(
    test_client: httpx.AsyncClient,
    beneficiary_sophie_tifour: Beneficiary,
    sophie_tifour_no_new_contraintes: dict,
    pe_settings,
):
    mock_pe_api(
        pe_settings, beneficiary_sophie_tifour, sophie_tifour_no_new_contraintes
    )

    response = await call_refresh_api(beneficiary_sophie_tifour, test_client)

    expect_data_to_have_been_refreshed(False, response)


@pytest.mark.graphql
@respx.mock
async def test_get_no_situations(
    test_client: httpx.AsyncClient,
    beneficiary_sophie_tifour: Beneficiary,
    notebook_sophie_tifour: Notebook,
    empty_contraintes: dict,
    pe_settings,
):
    mock_pe_api(
        pe_settings,
        beneficiary_sophie_tifour,
        empty_contraintes,
    )

    response = await call_refresh_api(beneficiary_sophie_tifour, test_client)

    expect_data_to_have_been_refreshed(True, response)

    situations = await get_notebook_situations_by_id(notebook_sophie_tifour.id)
    assert len(situations) == 0


@pytest.mark.graphql
async def test_does_nothing_when_the_pe_client_id_is_missing(
    test_client: httpx.AsyncClient,
    notebook_sophie_tifour: Notebook,
    pe_settings,
):
    pe_settings.PE_CLIENT_ID = ""

    response = await test_client.post(
        "/v1/notebooks/refresh-situations-from-pole-emploi",
        headers={"secret-token": "action_secret_token"},
        json=build_payload(notebook_id=notebook_sophie_tifour.id),
    )

    expect_data_to_have_been_refreshed(False, response)


@pytest.mark.graphql
async def test_does_nothing_when_the_pe_client_secret_is_missing(
    test_client: httpx.AsyncClient,
    notebook_sophie_tifour: Notebook,
    pe_settings,
):
    pe_settings.PE_CLIENT_SECRET = ""

    response = await test_client.post(
        "/v1/notebooks/refresh-situations-from-pole-emploi",
        headers={"secret-token": "action_secret_token"},
        json=build_payload(notebook_id=notebook_sophie_tifour.id),
    )

    expect_data_to_have_been_refreshed(False, response)


@pytest.mark.graphql
@respx.mock
async def test_produces_a_400_when_the_pe_api_returns_a_500(
    test_client: httpx.AsyncClient,
    beneficiary_sophie_tifour: Beneficiary,
    pe_settings,
):
    respx.post(f"{pe_settings.PE_AUTH_BASE_URL}/connexion/oauth2/access_token").mock(
        return_value=httpx.Response(
            500,
            json={
                "token_type": "foo",
                "access_token": "batman",
                "expires_in": 3600,
            },
        )
    )
    response = await call_refresh_api(beneficiary_sophie_tifour, test_client)

    assert response.status_code == 400


def build_payload(notebook_id: UUID):
    return {
        "action": {"name": "refresh-situations-from-pole-emploi"},
        "request_query": "",
        "session_variables": {},
        "input": {
            "notebookId": notebook_id,
        },
    }


async def get_notebook_situations_by_id(id):
    async with get_client.gql_client_backend_only() as session:
        result = await session.execute(
            gql(
                """
            query situations($id: uuid!) {
                notebook_situation(
                    where: {notebookId: {_eq: $id}  deletedAt: {_is_null: true}}
                    order_by: {createdAt: desc}
                ) {
                    id, refSituation{ description} createdAt
                }
            }
        """
            ),
            variable_values={"id": id},
        )
        return result["notebook_situation"]


def mock_pe_api(
    settings: Settings,
    beneficiary: Beneficiary,
    contraintes: dict,
):
    respx.post(f"{settings.PE_AUTH_BASE_URL}/connexion/oauth2/access_token").mock(
        return_value=httpx.Response(
            200,
            json={
                "token_type": "foo",
                "access_token": "batman",
                "expires_in": 3600,
            },
        )
    )
    respx.post(
        f"{settings.PE_BASE_URL}/partenaire/rechercher-usager/v1/usagers/recherche",
        json={
            "nir": beneficiary.nir,
            "dateNaissance": beneficiary.date_of_birth.strftime("%Y-%m-%d"),
        },
    ).mock(
        return_value=httpx.Response(200, json=PE_API_RECHERCHE_USAGERS_RESULT_OK_MOCK)
    )

    pe_internal_id = PE_API_RECHERCHE_USAGERS_RESULT_OK_MOCK["identifiant"]

    respx.get(
        f"{settings.PE_BASE_URL}/partenaire/diagnosticargumente/v1/individus/{quote(pe_internal_id)}/contraintes",
    ).mock(return_value=httpx.Response(200, json=contraintes))


@pytest.fixture(scope="session")
def empty_contraintes() -> dict:
    return {
        "conseiller": "TNAN0260",
        "dateDeModification": "2023-05-12T12:54:39.000+00:00",
        "code": "7",
        "libelle": "Résoudre ses contraintes personnelles",
        "contraintes": [],
    }


@pytest.fixture(scope="session")
def sophie_tifour_contraintes() -> dict:
    return {
        "conseiller": "TNAN0260",
        "dateDeModification": "2023-05-12T12:54:39.000+00:00",
        "code": "7",
        "libelle": "Résoudre ses contraintes personnelles",
        "contraintes": [
            {
                "id": 27,
                "nom": "Faire face à des difficultés de logement",
                "valeur": "NON_ABORDEE",
                "date": "2023-05-12T12:54:39.000+00:00",
                "situations": [
                    {
                        "code": "24",
                        "libelle": "Hébergé chez un tiers",
                        "valeur": "OUI",
                    },
                    {
                        "code": "27",
                        "libelle": "Doit quitter le logement",
                        "valeur": "OUI",
                    },
                ],
                "objectifs": [],
            },
            {
                "id": 29,
                "nom": "Faire face à des difficultés administratives ou juridiques",
                "valeur": "CLOTUREE",
                "date": None,
                "situations": [
                    {
                        "code": "36",
                        "libelle": "Besoin d'etre guidé dans le cadre d'un accès aux droits",  # noqa: E501
                        "valeur": "CLOTUREE",
                    },
                ],
                "objectifs": [],
            },
        ],
    }


@pytest.fixture(scope="session")
def sophie_tifour_no_new_contraintes() -> dict:
    return {
        "conseiller": "TNAN0260",
        "dateDeModification": "2023-05-12T12:54:39.000+00:00",
        "code": "7",
        "libelle": "Résoudre ses contraintes personnelles",
        "contraintes": [
            {
                "id": 27,
                "nom": "Faire face à des difficultés de logement",
                "valeur": "NON_ABORDEE",
                "date": "2023-05-12T12:54:39.000+00:00",
                "situations": [
                    {
                        "code": "24",
                        "libelle": "Hébergé chez un tiers",
                        "valeur": "OUI",
                    },
                    {
                        "code": "27",
                        "libelle": "Besoin d'être guidé dans le cadre d'un accès aux droits",  # noqa: E501
                        "valeur": "OUI",
                    },
                    {
                        "code": "26",
                        "libelle": "Prêt  à suivre une formation",
                        "valeur": "OUI",
                    },
                ],
                "objectifs": [],
            },
        ],
    }


@pytest.fixture(scope="session")
def sophie_tifour_add_only_contraintes() -> dict:
    return {
        "conseiller": "TNAN0260",
        "dateDeModification": "2023-05-12T12:54:39.000+00:00",
        "code": "7",
        "libelle": "Résoudre ses contraintes personnelles",
        "contraintes": [
            {
                "id": 27,
                "nom": "Faire face à des difficultés de logement",
                "valeur": "NON_ABORDEE",
                "date": "2023-05-12T12:54:39.000+00:00",
                "situations": [
                    {
                        "code": "24",
                        "libelle": "Hébergé chez un tiers",
                        "valeur": "OUI",
                    },
                    {
                        "code": "27",
                        "libelle": "Besoin d'être guidé dans le cadre d'un accès aux droits",  # noqa: E501
                        "valeur": "OUI",
                    },
                    {
                        "code": "26",
                        "libelle": "Prêt  à suivre une formation",
                        "valeur": "OUI",
                    },
                ],
                "objectifs": [],
            },
            {
                "id": 29,
                "nom": "Faire face à des difficultés administratives ou juridiques",
                "valeur": "CLOTUREE",
                "date": "2022-05-12T12:54:39.000+00:00",
                "situations": [
                    {
                        "code": "36",
                        "libelle": "Attend un enfant ou plus",
                        "valeur": "OUI",
                    },
                ],
                "objectifs": [],
            },
        ],
    }


async def given_beneficiary_has_external_data_at_dates(
    dates, beneficiary, db_connection
):
    for date in dates:
        await given_beneficiary_has_pe_io_data(beneficiary, date, db_connection)


def expect_data_to_have_been_refreshed(refreshed, response):
    assert response.status_code == 200
    assert response.json() == {"data_has_been_updated": refreshed}


async def call_refresh_api(beneficiary, test_client):
    response = await test_client.post(
        "/v1/notebooks/refresh-situations-from-pole-emploi",
        headers={"secret-token": "action_secret_token"},
        json=build_payload(notebook_id=beneficiary.notebook.id),
    )
    return response


def fresh_creation_date():
    return expired_date() + timedelta(minutes=1)


async def given_beneficiary_has_pe_io_data(beneficiary, created_at, db_connection):
    external_data = await insert_external_data(
        db_connection,
        ExternalDataInsert(data={}, hash="hash", source=ExternalSource.PE_IO),
    )
    assert external_data
    await insert_external_data_info(
        db_connection,
        ExternalDataInfoInsert(
            external_data_id=external_data.id,
            beneficiary_id=beneficiary.id,
            created_at=created_at,
        ),
    )


async def given_external_data_with_pe_io(db_connection):
    external_data = await insert_external_data(
        db_connection,
        ExternalDataInsert(data={}, hash="hash", source=ExternalSource.PE_IO),
    )
    assert external_data
    return external_data


def given_pe_data_is_different(different, call_pe):
    call_pe.return_value = different


def expired_date():
    return datetime.now(tz=timezone.utc) - timedelta(hours=1)
