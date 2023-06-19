from unittest import mock

import pytest
from httpx import AsyncClient

from cdb.api.db.models.orientation_request import OrientationRequest
from cdb.api.db.models.professional import Professional
from tests.utils.approvaltests import verify

pytestmark = pytest.mark.graphql

DENY_ORIENTATION_ENDPOINT_PATH = "/v1/orientation_requests/deny"


@mock.patch("cdb.api.core.emails.send_mail")
async def test_deny_orientation_request_email(
    mock_send_email: mock.Mock,
    test_client: AsyncClient,
    professional_edith_orial: Professional,
    orientation_request_jennings_dee: OrientationRequest,
    giulia_diaby_jwt: str,
):
    response = await test_client.post(
        DENY_ORIENTATION_ENDPOINT_PATH,
        json={
            "orientation_request_id": orientation_request_jennings_dee.id,
        },
        headers={"Authorization": "Bearer " + giulia_diaby_jwt},
    )
    print(response.json())
    assert response.status_code == 200
    assert mock_send_email.call_count == 1

    email_new_referent = mock_send_email.call_args_list[0]
    assert email_new_referent.kwargs["to"] == professional_edith_orial.email
    assert email_new_referent.kwargs["subject"] == "Maintien de l’accompagnement"
    verify(email_new_referent.kwargs["message"], extension=".html")
