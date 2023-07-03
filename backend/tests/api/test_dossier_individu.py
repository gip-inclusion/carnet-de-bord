from datetime import datetime, timedelta, timezone
from uuid import UUID

import httpx
import pytest
from asyncpg import Connection

from cdb.api.db.crud.external_data import (
    insert_external_data,
    insert_external_data_info,
)
from cdb.api.db.models.external_data import (
    ExternalDataInfoInsert,
    ExternalDataInsert,
    ExternalSource,
)
from cdb.api.db.models.notebook import Notebook
from cdb.pe.models.beneficiary import Beneficiary
from tests.mocks.pole_emploi_dossier_individu import DOSSIER_INDIVIDU


def build_payload(notebook_id: UUID):
    return {
        "action": {"name": "diagnostic_pole_emploi"},
        "request_query": "",
        "session_variables": {},
        "input": {
            "notebookId": notebook_id,
        },
    }


async def test_get_dossier_individu_return_401(
    test_client: httpx.AsyncClient,
    notebook_sophie_tifour: Notebook,
):
    response = await test_client.post(
        "/v1/notebooks/dossier-individu-pole-emploi",
        json=build_payload(notebook_id=notebook_sophie_tifour.id),
    )
    assert response.status_code == 401
    json = response.json()
    assert json["detail"] == "Missing credentials"


@pytest.mark.graphql
async def test_get_dossier_individu_return_null_if_no_dossier_individu(
    test_client: httpx.AsyncClient,
    db_connection: Connection,
    beneficiary_sophie_tifour: Beneficiary,
    notebook_sophie_tifour: Notebook,
):
    external_data = await insert_external_data(
        db_connection,
        ExternalDataInsert(data={}, hash="hash", source=ExternalSource.PE_FTP),
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

    response = await test_client.post(
        "/v1/notebooks/dossier-individu-pole-emploi",
        json=build_payload(notebook_id=notebook_sophie_tifour.id),
        headers={"secret-token": "action_secret_token"},
    )
    assert response.status_code == 200
    json = response.json()
    assert json is None


@pytest.mark.graphql
async def test_get_dossier_indidu_return_dossier_individu(
    test_client: httpx.AsyncClient,
    db_connection: Connection,
    beneficiary_sophie_tifour: Beneficiary,
    notebook_sophie_tifour: Notebook,
):
    external_data = await insert_external_data(
        db_connection,
        ExternalDataInsert(
            data=DOSSIER_INDIVIDU, hash="hash", source=ExternalSource.PE_IO
        ),
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

    response = await test_client.post(
        "/v1/notebooks/dossier-individu-pole-emploi",
        json=build_payload(notebook_id=notebook_sophie_tifour.id),
        headers={"secret-token": "action_secret_token"},
    )
    assert response.status_code == 200
    json = response.json()
    assert json
