import uuid
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


async def test_returns_201_when_success(
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
    json = response.json()
    assert uuid.UUID(str(json["notebookId"]))


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
    created_notebook_id = json["notebookId"]
    notebook = await get_notebook_by_id(db_connection, created_notebook_id)
    beneficiary = await get_beneficiary_by_id(db_connection, notebook.beneficiary_id)
    assert beneficiary.firstname == "Jay"


def get_mutation(
    deployment_id: UUID,
    account_id: UUID,
    firstname: str,
    lastname: str,
    nir: str,
    date_of_birth: str,
):
    return {
        "action": {"name": "create_notebook"},
        "input": {
            "notebook": {
                "nir": nir,
                "firstname": firstname,
                "lastname": lastname,
                "dateOfBirth": date_of_birth,
            },
        },
        "request_query": "",
        "session_variables": {
            "x-hasura-deployment-id": deployment_id,
            "x-hasura-account-id": account_id,
        },
    }
