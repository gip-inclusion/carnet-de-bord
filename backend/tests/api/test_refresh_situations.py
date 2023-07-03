import json
from datetime import datetime, timedelta, timezone
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
from tests.mocks.pole_emploi_recherche_usagers import (
    PE_API_RECHERCHE_USAGERS_RESULT_KO_MOCK,
    PE_API_RECHERCHE_USAGERS_RESULT_OK_MOCK,
)
from tests.utils.approvaltests import verify_as_json

pytestmark = pytest.mark.graphql


@pytest.fixture
async def pe_settings():
    settings.PE_CLIENT_SECRET = "pe_client_secret"
    settings.PE_CLIENT_ID = "pe_client_id"
    settings.ENABLE_SYNC_CONTRAINTES = True
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
    sophie_tifour_pe_diagnostic_with_contraintes: dict,
    pe_settings,
):
    mock_pe_api(
        pe_settings,
        beneficiary_sophie_tifour,
        sophie_tifour_pe_diagnostic_with_contraintes,
    )

    response = await call_refresh_api(notebook_sophie_tifour.id, test_client)

    expect_ok_response(
        response,
        {
            "data_has_been_updated": True,
            "external_data_has_been_updated": True,
            "has_pe_diagnostic": True,
        },
    )

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
    sophie_tifour_pe_diagnostic_with_add_only_contraintes: dict,
    notebook_sophie_tifour: Notebook,
    pe_settings,
):
    mock_pe_api(
        pe_settings,
        beneficiary_sophie_tifour,
        sophie_tifour_pe_diagnostic_with_add_only_contraintes,
    )

    response = await call_refresh_api(notebook_sophie_tifour.id, test_client)

    expect_ok_response(
        response,
        {
            "data_has_been_updated": True,
            "external_data_has_been_updated": True,
            "has_pe_diagnostic": True,
        },
    )


@pytest.mark.graphql
@respx.mock
# updates cdb data and external data when there are new constraints and no external data
async def test_updates_cdb_data_and_external_data_when_there_are_new_constraintes_and_no_external_data(  # noqa: E501
    test_client: httpx.AsyncClient,
    beneficiary_sophie_tifour: Beneficiary,
    notebook_sophie_tifour: Notebook,
    sophie_tifour_pe_diagnostic_with_add_only_contraintes: dict,
    pe_settings,
):
    mock_pe_api(
        pe_settings,
        beneficiary_sophie_tifour,
        sophie_tifour_pe_diagnostic_with_add_only_contraintes,
    )

    response = await call_refresh_api(notebook_sophie_tifour.id, test_client)

    expect_ok_response(
        response,
        {
            "data_has_been_updated": True,
            "external_data_has_been_updated": True,
            "has_pe_diagnostic": True,
        },
    )


@pytest.mark.graphql
@respx.mock
async def test_does_nothing_when_pe_has_no_info_for_our_beneficiary(
    test_client: httpx.AsyncClient,
    beneficiary_sophie_tifour: Beneficiary,
    notebook_sophie_tifour: Notebook,
    pe_settings: Settings,
):
    mock_pe_api_not_found_individu(pe_settings, beneficiary_sophie_tifour)

    response = await call_refresh_api(notebook_sophie_tifour.id, test_client)

    expect_ok_response(
        response,
        {
            "data_has_been_updated": False,
            "external_data_has_been_updated": False,
            "has_pe_diagnostic": False,
        },
    )


@pytest.mark.graphql
@respx.mock
async def test_does_nothing_when_our_pe_data_was_fetched_recently(
    test_client: httpx.AsyncClient,
    beneficiary_sophie_tifour: Beneficiary,
    notebook_sophie_tifour: Notebook,
    db_connection: Connection,
    pe_settings: Settings,
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

    response = await call_refresh_api(notebook_sophie_tifour.id, test_client)
    pe_internal_id = PE_API_RECHERCHE_USAGERS_RESULT_OK_MOCK["identifiant"]
    route = respx.get(
        f"{pe_settings.PE_BASE_URL}/partenaire/diagnosticargumente/v1/individus/{quote(pe_internal_id)}",
    )
    assert not route.called

    expect_ok_response(
        response,
        {
            "data_has_been_updated": False,
            "external_data_has_been_updated": False,
            "has_pe_diagnostic": True,
        },
    )


@pytest.mark.graphql
@respx.mock
async def test_does_nothing_when_we_do_not_find_requested_notebook(
    test_client: httpx.AsyncClient,
):
    response = await call_refresh_api(
        UUID("8341681f-aef3-4d28-baf6-763435b253d6"), test_client
    )

    assert response.status_code == 200
    assert response.json() is None


@pytest.mark.graphql
@respx.mock
async def test_refreshes_data_from_pe_when_they_have_expired(
    test_client: httpx.AsyncClient,
    db_connection: Connection,
    beneficiary_sophie_tifour: Beneficiary,
    notebook_sophie_tifour: Notebook,
    sophie_tifour_pe_diagnostic_with_contraintes: dict,
    pe_settings: Settings,
):
    mock_pe_api(
        pe_settings,
        beneficiary_sophie_tifour,
        sophie_tifour_pe_diagnostic_with_contraintes,
    )

    await given_beneficiary_has_external_data_at_dates(
        [expired_date()], beneficiary_sophie_tifour, db_connection
    )

    response = await call_refresh_api(notebook_sophie_tifour.id, test_client)

    expect_ok_response(
        response,
        {
            "data_has_been_updated": True,
            "external_data_has_been_updated": True,
            "has_pe_diagnostic": True,
        },
    )


@pytest.mark.graphql
@respx.mock
async def test_does_nothing_when_at_least_one_external_data_is_fresh(
    test_client: httpx.AsyncClient,
    beneficiary_sophie_tifour: Beneficiary,
    notebook_sophie_tifour: Notebook,
    db_connection: Connection,
    pe_settings: Settings,
):
    await given_beneficiary_has_external_data_at_dates(
        [fresh_creation_date(), expired_date()],
        beneficiary_sophie_tifour,
        db_connection,
    )
    response = await call_refresh_api(notebook_sophie_tifour.id, test_client)

    pe_internal_id = PE_API_RECHERCHE_USAGERS_RESULT_OK_MOCK["identifiant"]
    route = respx.get(
        f"{pe_settings.PE_BASE_URL}/partenaire/diagnosticargumente/v1/individus/{quote(pe_internal_id)}",
    )
    assert not route.called

    expect_ok_response(
        response,
        {
            "data_has_been_updated": False,
            "external_data_has_been_updated": False,
            "has_pe_diagnostic": True,
        },
    )


@pytest.mark.graphql
@respx.mock
async def test_does_nothing_when_feature_is_disabled(
    test_client: httpx.AsyncClient,
    notebook_sophie_tifour: Notebook,
    pe_settings: Settings,
):
    pe_settings.ENABLE_SITUATION_API = False
    pe_internal_id = PE_API_RECHERCHE_USAGERS_RESULT_OK_MOCK["identifiant"]
    route = respx.get(
        f"{pe_settings.PE_BASE_URL}/partenaire/diagnosticargumente/v1/individus/{quote(pe_internal_id)}",
    )
    response = await call_refresh_api(notebook_sophie_tifour.id, test_client)
    assert not route.called
    expect_ok_response(
        response,
        {
            "data_has_been_updated": False,
            "external_data_has_been_updated": False,
            "has_pe_diagnostic": False,
        },
    )

    pe_settings.ENABLE_SITUATION_API = True


@pytest.mark.graphql
@respx.mock
async def test_saves_the_new_pe_diagnostic_into_external_data(
    test_client: httpx.AsyncClient,
    beneficiary_sophie_tifour: Beneficiary,
    notebook_sophie_tifour: Notebook,
    sophie_tifour_pe_diagnostic_with_add_only_contraintes: dict,
    db_connection: Connection,
    pe_settings,
):
    mock_pe_api(
        pe_settings,
        beneficiary_sophie_tifour,
        sophie_tifour_pe_diagnostic_with_add_only_contraintes,
    )
    await given_beneficiary_has_external_data_at_dates(
        [], beneficiary_sophie_tifour, db_connection
    )

    response = await call_refresh_api(notebook_sophie_tifour.id, test_client)

    record: Record = await get_last_saved_external_data(
        beneficiary_sophie_tifour.id, ExternalSource.PE_IO, db_connection
    )
    verify_as_json(
        {
            "data": json.loads(record["data"]),
            "source": record["source"],
            "hash": record["hash"],
        }
    )
    expect_ok_response(
        response,
        {
            "data_has_been_updated": True,
            "external_data_has_been_updated": True,
            "has_pe_diagnostic": True,
        },
    )


@pytest.mark.graphql
@respx.mock
# TODO : Changer le setup pour pas appeler 2 fois le endpoint
# TODO : On souhaite conserver la date de derniere récupération pour ne pas rappeler
# PE a chaque fois dans le cas ou les données n'ont pas changée
async def test_does_not_store_anything_if_pe_data_has_not_changed_since_last_fetch(
    test_client: httpx.AsyncClient,
    beneficiary_sophie_tifour: Beneficiary,
    notebook_sophie_tifour: Notebook,
    sophie_tifour_pe_diagnostic_with_contraintes: dict,
    db_connection: Connection,
    pe_settings,
):
    mock_pe_api(
        pe_settings,
        beneficiary_sophie_tifour,
        sophie_tifour_pe_diagnostic_with_contraintes,
    )
    before = expired_date()

    await call_refresh_api(notebook_sophie_tifour.id, test_client)
    # update created_at so it happened in the past
    await update_external_data_created_at(
        beneficiary_sophie_tifour.id, before, db_connection
    )

    response = await call_refresh_api(notebook_sophie_tifour.id, test_client)

    result = await get_last_saved_external_data(
        beneficiary_sophie_tifour.id, ExternalSource.PE_IO, db_connection
    )
    assert result["created_at"] == before
    expect_ok_response(
        response,
        {
            "data_has_been_updated": False,
            "external_data_has_been_updated": False,
            "has_pe_diagnostic": True,
        },
    )


@pytest.mark.graphql
@respx.mock
async def test_does_nothing_when_data_from_pe_is_new_but_matches_our_situations(
    test_client: httpx.AsyncClient,
    beneficiary_sophie_tifour: Beneficiary,
    notebook_sophie_tifour: Notebook,
    sophie_tifour_pe_diagnostic_with_no_new_contraintes: dict,
    pe_settings,
):
    mock_pe_api(
        pe_settings,
        beneficiary_sophie_tifour,
        sophie_tifour_pe_diagnostic_with_no_new_contraintes,
    )

    response = await call_refresh_api(notebook_sophie_tifour.id, test_client)

    expect_ok_response(
        response,
        {
            "data_has_been_updated": False,
            "external_data_has_been_updated": True,
            "has_pe_diagnostic": True,
        },
    )


@pytest.mark.graphql
@respx.mock
async def test_update_situation_when_received_situation_are_an_empty_array(
    test_client: httpx.AsyncClient,
    beneficiary_sophie_tifour: Beneficiary,
    notebook_sophie_tifour: Notebook,
    sophie_tifour_pe_diagnostic_with_empty_contraintes: dict,
    pe_settings,
):
    mock_pe_api(
        pe_settings,
        beneficiary_sophie_tifour,
        sophie_tifour_pe_diagnostic_with_empty_contraintes,
    )

    response = await call_refresh_api(notebook_sophie_tifour.id, test_client)

    expect_ok_response(
        response,
        {
            "data_has_been_updated": True,
            "external_data_has_been_updated": True,
            "has_pe_diagnostic": True,
        },
    )

    situations = await get_notebook_situations_by_id(notebook_sophie_tifour.id)
    assert len(situations) == 0


# TODO: remove ?
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

    expect_ok_response(
        response,
        {
            "data_has_been_updated": False,
            "external_data_has_been_updated": False,
            "has_pe_diagnostic": False,
        },
    )


# TODO: remove ?
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

    expect_ok_response(
        response,
        {
            "data_has_been_updated": False,
            "external_data_has_been_updated": False,
            "has_pe_diagnostic": False,
        },
    )


@pytest.mark.graphql
@respx.mock
async def test_produces_a_400_when_the_pe_api_returns_a_500(
    test_client: httpx.AsyncClient,
    notebook_sophie_tifour: Notebook,
    pe_settings,
):
    """To forward api errors through the Hasura action it needs a 400 error"""
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
    response = await call_refresh_api(notebook_sophie_tifour.id, test_client)

    assert response.status_code == 400


@pytest.mark.graphql
@respx.mock
async def test_does_not_update_cdb_when_sync_flag_is_false(
    test_client: httpx.AsyncClient,
    beneficiary_sophie_tifour: Beneficiary,
    pe_settings: Settings,
    sophie_tifour_pe_diagnostic_with_empty_contraintes,
    notebook_sophie_tifour: Notebook,
):
    pe_settings.ENABLE_SYNC_CONTRAINTES = False

    mock_pe_api(
        pe_settings,
        beneficiary_sophie_tifour,
        sophie_tifour_pe_diagnostic_with_empty_contraintes,
    )

    response = await call_refresh_api(notebook_sophie_tifour.id, test_client)

    expect_ok_response(
        response,
        {
            "data_has_been_updated": False,
            "external_data_has_been_updated": True,
            "has_pe_diagnostic": True,
        },
    )

    situations = await get_notebook_situations_by_id(notebook_sophie_tifour.id)
    assert len(situations) != 0


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
    pe_diagnostic: dict | None,
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

    if not pe_diagnostic:
        dossier_individu_response_code = 204
        dossier_individu_response = None
    else:
        dossier_individu_response_code = 200
        dossier_individu_response = pe_diagnostic

    respx.get(
        f"{settings.PE_BASE_URL}/partenaire/diagnosticargumente/v1/individus/{quote(pe_internal_id)}",
    ).mock(
        return_value=httpx.Response(
            dossier_individu_response_code, json=dossier_individu_response
        )
    )


def mock_pe_api_not_found_individu(
    settings: Settings,
    beneficiary: Beneficiary,
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
        return_value=httpx.Response(200, json=PE_API_RECHERCHE_USAGERS_RESULT_KO_MOCK)
    )


@pytest.fixture(scope="session")
def sophie_tifour_pe_diagnostic_with_empty_contraintes() -> dict:
    return {
        "besoinsParDiagnosticIndividuDtos": [],
        "contraintesIndividusDto": {
            "conseiller": "TNAN0260",
            "dateDeModification": "2023-05-12T12:54:39.000+00:00",
            "code": "7",
            "libelle": "Résoudre ses contraintes personnelles",
            "contraintes": [],
        },
    }


@pytest.fixture(scope="session")
def sophie_tifour_pe_diagnostic_with_contraintes() -> dict:
    return {
        "besoinsParDiagnosticIndividuDtos": [],
        "contraintesIndividusDto": {
            "conseiller": "TNAN0260",
            "dateDeModification": "2023-05-12T12:54:39.000+00:00",
            "code": "7",
            "libelle": "Résoudre ses contraintes personnelles",
            "contraintes": [
                {
                    "code": "27",
                    "libelle": "Faire face à des difficultés de logement",
                    "valeur": "OUI",
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
                    "code": "29",
                    "libelle": "Faire face à des difficultés administratives ou juridiques",  # noqa: E501
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
        },
    }


@pytest.fixture(scope="session")
def sophie_tifour_pe_diagnostic_with_no_new_contraintes() -> dict:
    return {
        "besoinsParDiagnosticIndividuDtos": [],
        "contraintesIndividusDto": {
            "conseiller": "TNAN0260",
            "dateDeModification": "2023-05-12T12:54:39.000+00:00",
            "code": "7",
            "libelle": "Résoudre ses contraintes personnelles",
            "contraintes": [
                {
                    "code": "27",
                    "libelle": "Faire face à des difficultés de logement",
                    "valeur": "OUI",
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
        },
    }


@pytest.fixture(scope="session")
def sophie_tifour_pe_diagnostic_with_add_only_contraintes() -> dict:
    return {
        "besoinsParDiagnosticIndividuDtos": [],
        "contraintesIndividusDto": {
            "conseiller": "TNAN0260",
            "dateDeModification": "2023-05-12T12:54:39.000+00:00",
            "code": "7",
            "libelle": "Résoudre ses contraintes personnelles",
            "contraintes": [
                {
                    "code": "27",
                    "libelle": "Faire face à des difficultés de logement",
                    "valeur": "OUI",
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
                    "code": "29",
                    "libelle": "Faire face à des difficultés administratives ou juridiques",  # noqa: E501
                    "valeur": "OUI",
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
        },
    }


async def given_beneficiary_has_external_data_at_dates(
    dates, beneficiary, db_connection
):
    for date in dates:
        await given_beneficiary_has_pe_io_data(beneficiary, date, db_connection)


def expect_ok_response(response, expected_response_dict):
    assert response.status_code == 200
    assert response.json().items() == expected_response_dict.items()


async def call_refresh_api(uuid: UUID, test_client):
    response = await test_client.post(
        "/v1/notebooks/refresh-situations-from-pole-emploi",
        headers={"secret-token": "action_secret_token"},
        json=build_payload(notebook_id=uuid),
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


def expired_date():
    return datetime.now(tz=timezone.utc) - timedelta(hours=1)
