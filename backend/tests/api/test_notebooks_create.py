import uuid
from datetime import date
from uuid import UUID

import pytest
from asyncpg import Connection
from httpx import AsyncClient

from cdb.api.db.crud.beneficiary import get_beneficiary_by_id
from cdb.api.db.crud.notebook import get_notebook_by_id

pytestmark = pytest.mark.graphql


async def test_returns_401_when_there_is_no_token(
    test_client: AsyncClient,
):
    response = await test_client.post("/v1/notebooks")
    assert response.status_code == 401
    json = response.json()
    assert json["detail"] == "Missing credentials"


async def test_returns_403_when_token_is_wrong(
    test_client: AsyncClient,
):
    response = await test_client.post(
        "/v1/notebooks",
        headers={"secret-token": "very_wrong_token"},
    )
    assert response.status_code == 403
    json = response.json()
    assert json["detail"] == "Provided credentials are invalid"


async def test_returns_409_when_nir_already_exists(
    test_client: AsyncClient,
    deployment_id_cd93,
    get_manager_cd_93_account_id,
):
    response = await test_client.post(
        "/v1/notebooks",
        json=get_mutation(
            deployment_id=deployment_id_cd93,
            account_id=get_manager_cd_93_account_id,
            nir="1781299212296",
            firstname="Jay",
            lastname="Erdaivéï",
            date_of_birth="2000-12-01",
        ),
        headers={"secret-token": "action_secret_token"},
    )
    assert response.status_code == 201
    notebookId = response.json()["notebookId"]

    response = await test_client.post(
        "/v1/notebooks",
        json=get_mutation(
            deployment_id=deployment_id_cd93,
            account_id=get_manager_cd_93_account_id,
            nir="1781299212296",
            firstname="Jay",
            lastname="Erdaivéï",
            date_of_birth="2000-12-01",
        ),
        headers={"secret-token": "action_secret_token"},
    )
    assert response.status_code == 409
    json = response.json()
    assert json["message"] == "notebook already exists"
    assert json["extensions"]["notebookId"] == notebookId


async def test_returns_400_when_nir_already_exists_in_another_deployment(
    test_client: AsyncClient,
    deployment_id_cd93,
    deployment_id_cd51,
    get_manager_cd_51_account_id,
    get_manager_cd_93_account_id,
):
    response = await test_client.post(
        "/v1/notebooks",
        json=get_mutation(
            deployment_id=deployment_id_cd93,
            account_id=get_manager_cd_93_account_id,
            nir="1781299212296",
            firstname="Jay",
            lastname="Erdaivéï",
            date_of_birth="2000-12-01",
        ),
        headers={"secret-token": "action_secret_token"},
    )
    assert response.status_code == 201
    response.json()["notebookId"]

    response = await test_client.post(
        "/v1/notebooks",
        json=get_mutation(
            deployment_id=deployment_id_cd51,
            account_id=get_manager_cd_51_account_id,
            nir="1781299212296",
            firstname="Jay",
            lastname="Erdaivéï",
            date_of_birth="2000-12-01",
        ),
        headers={"secret-token": "action_secret_token"},
    )
    assert response.status_code == 400
    json = response.json()
    assert json["message"] == "found notebook from a different deployment"


async def test_creates_notebook_and_beneficiary(
    test_client: AsyncClient,
    deployment_id_cd93,
    get_manager_cd_93_account_id,
    db_connection: Connection,
):
    response = await test_client.post(
        "/v1/notebooks",
        json=get_mutation(
            deployment_id=deployment_id_cd93,
            account_id=get_manager_cd_93_account_id,
            nir="1781299212296",
            firstname="Jay",
            lastname="Erdaivéï",
            date_of_birth="2000-12-01",
        ),
        headers={"secret-token": "action_secret_token"},
    )
    assert response.status_code == 201
    json = response.json()
    assert uuid.UUID(str(json["notebookId"]))
    created_notebook_id = json["notebookId"]
    notebook = await get_notebook_by_id(db_connection, created_notebook_id)
    assert notebook
    beneficiary = await get_beneficiary_by_id(db_connection, notebook.beneficiary_id)
    assert beneficiary
    assert beneficiary.firstname == "Jay"


async def test_creates_notebook_and_beneficiary_with_15_digits_nir(
    test_client: AsyncClient,
    deployment_id_cd93,
    get_manager_cd_93_account_id,
):
    response = await test_client.post(
        "/v1/notebooks",
        json=get_mutation(
            deployment_id=deployment_id_cd93,
            account_id=get_manager_cd_93_account_id,
            nir="178129921229686",
            firstname="Jay",
            lastname="Erdaivéï",
            date_of_birth="2000-12-01",
        ),
        headers={"secret-token": "action_secret_token"},
    )
    assert response.status_code == 201
    json = response.json()
    assert uuid.UUID(str(json["notebookId"]))


async def test_creates_notebook_and_beneficiary_with_all_fields(
    test_client: AsyncClient,
    deployment_id_cd93,
    get_manager_cd_93_account_id,
    db_connection: Connection,
):
    response = await test_client.post(
        "/v1/notebooks",
        json=get_mutation(
            deployment_id=deployment_id_cd93,
            account_id=get_manager_cd_93_account_id,
            nir="1781299212296",
            firstname="Jay",
            lastname="Erdaivéï",
            date_of_birth="2000-12-01",
            external_id="some-id",
            mobile_number="0612345678",
            email="jay@rdvi.fr",
            address1="rue de l'open space",
            address2="bureau #42",
            postal_code="42666",
            city="CDBVille",
            caf_number="666",
        ),
        headers={"secret-token": "action_secret_token"},
    )
    assert response.status_code == 201
    json = response.json()
    created_notebook_id = json["notebookId"]
    notebook = await get_notebook_by_id(db_connection, created_notebook_id)
    beneficiary = await get_beneficiary_by_id(db_connection, notebook.beneficiary_id)
    assert beneficiary
    assert beneficiary.nir == "1781299212296"
    assert beneficiary.firstname == "Jay"
    assert beneficiary.lastname == "Erdaivéï"
    assert beneficiary.date_of_birth == date(2000, 12, 1)
    assert beneficiary.external_id == "some-id"
    assert beneficiary.mobile_number == "0612345678"
    assert beneficiary.email == "jay@rdvi.fr"
    assert beneficiary.address1 == "rue de l'open space"
    assert beneficiary.address2 == "bureau #42"
    assert beneficiary.postal_code == "42666"
    assert beneficiary.city == "CDBVille"
    assert beneficiary.caf_number == "666"


def get_mutation(
    deployment_id: UUID,
    account_id: UUID,
    firstname: str,
    lastname: str,
    nir: str,
    date_of_birth: str,
    external_id: str | None = None,
    mobile_number: str | None = None,
    email: str | None = None,
    address1: str | None = None,
    address2: str | None = None,
    postal_code: str | None = None,
    city: str | None = None,
    caf_number: str | None = None,
):
    return {
        "action": {"name": "create_notebook"},
        "input": {
            "notebook": {
                "nir": nir,
                "firstname": firstname,
                "lastname": lastname,
                "dateOfBirth": date_of_birth,
                "externalId": external_id,
                "mobileNumber": mobile_number,
                "email": email,
                "address1": address1,
                "address2": address2,
                "postalCode": postal_code,
                "city": city,
                "cafNumber": caf_number,
            },
        },
        "request_query": "",
        "session_variables": {
            "x-hasura-deployment-id": deployment_id,
            "x-hasura-user-id": account_id,
            "x-hasura-role": "manager",
        },
    }
