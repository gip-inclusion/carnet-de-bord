from unittest import mock

from fastapi.testclient import TestClient

from backend.api.db.models.orientation_request import OrientationRequest
from backend.api.db.models.professional import Professional

DENY_ORIENTATION_ENDPOINT_PATH = "/v1/orientation_requests/deny"


@mock.patch("backend.api.core.emails.send_mail")
async def test_deny_orientation_request_email(
    mock_send_email: mock.Mock,
    test_client: TestClient,
    snapshot,
    professional_edith_orial: Professional,
    orientation_request_jennings_dee: OrientationRequest,
    giulia_diaby_jwt: str,
):
    response = test_client.post(
        DENY_ORIENTATION_ENDPOINT_PATH,
        json={
            "orientation_request_id": str(orientation_request_jennings_dee.id),
        },
        headers={"jwt-token": f"{giulia_diaby_jwt}"},
    )
    print(response.json())
    assert response.status_code == 200
    assert mock_send_email.call_count == 1

    email_new_referent = mock_send_email.call_args_list[0]
    assert email_new_referent.kwargs["to"] == professional_edith_orial.email
    assert email_new_referent.kwargs["subject"] == "Maintien de l’accompagnement"
    assert snapshot == {"email_new_referent": email_new_referent.kwargs["message"]}
