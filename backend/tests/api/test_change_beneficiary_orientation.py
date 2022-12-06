from unittest import mock

from asyncpg.connection import Connection
from fastapi.testclient import TestClient

from api.db.crud.orientation_request import get_orientation_request_by_id
from api.db.models.beneficiary import Beneficiary
from api.db.models.notebook import Notebook
from api.db.models.notebook_info import OrientationType
from api.db.models.orientation_request import OrientationRequest
from api.db.models.professional import Professional

ENDPOINT_PATH = "/v1/change-beneficiary-orientation"


@mock.patch("api.core.emails.send_mail")
async def test_verify_no_token(
    mock_send_email: mock.Mock,
    test_client: TestClient,
    professional_pierre_chevalier: Professional,
    beneficiary_sophie_tifour: Beneficiary,
    notebook_sophie_tifour: Notebook,
):
    response = test_client.post(
        ENDPOINT_PATH,
        json={
            "orientation_type": OrientationType.social,
            "notebook_id": str(notebook_sophie_tifour.id),
            "beneficiary_id": str(beneficiary_sophie_tifour.id),
            "structure_id": str(professional_pierre_chevalier.structure_id),
            "professional_account_id": str(professional_pierre_chevalier.account_id),
        },
    )
    assert response.status_code == 401
    json = response.json()
    assert json["detail"] == "Missing credentials"


@mock.patch("api.core.emails.send_mail")
async def test_professional_not_allowed_to_change_orientation(
    _: mock.Mock,
    test_client: TestClient,
    professional_pierre_chevalier: Professional,
    beneficiary_sophie_tifour: Beneficiary,
    notebook_sophie_tifour: Notebook,
    get_professional_jwt: str,
):
    response = test_client.post(
        ENDPOINT_PATH,
        json={
            "orientation_type": OrientationType.social,
            "notebook_id": str(notebook_sophie_tifour.id),
            "beneficiary_id": str(beneficiary_sophie_tifour.id),
            "structure_id": str(professional_pierre_chevalier.structure_id),
            "professional_account_id": str(professional_pierre_chevalier.account_id),
        },
        headers={"jwt-token": f"{get_professional_jwt}"},
    )
    assert response.status_code == 403
    json = response.json()
    assert json["detail"] == "Operation forbidden to the given role"


@mock.patch("api.core.emails.send_mail")
async def test_change_orientation_with_exisiting_pro_in_members(
    _: mock.Mock,
    test_client: TestClient,
    professional_pierre_chevalier: Professional,
    beneficiary_sophie_tifour: Beneficiary,
    notebook_sophie_tifour: Notebook,
    guilia_diaby_jwt: str,
):
    response = test_client.post(
        ENDPOINT_PATH,
        json={
            "orientation_type": OrientationType.social,
            "notebook_id": str(notebook_sophie_tifour.id),
            "beneficiary_id": str(beneficiary_sophie_tifour.id),
            "structure_id": str(professional_pierre_chevalier.structure_id),
            "professional_account_id": str(professional_pierre_chevalier.account_id),
        },
        headers={"jwt-token": f"{guilia_diaby_jwt}"},
    )
    assert response.status_code == 200


@mock.patch("api.core.emails.send_mail")
async def test_change_orientation_with_structure_only(
    _: mock.Mock,
    test_client: TestClient,
    professional_pierre_chevalier: Professional,
    beneficiary_sophie_tifour: Beneficiary,
    notebook_sophie_tifour: Notebook,
    guilia_diaby_jwt: str,
):
    response = test_client.post(
        ENDPOINT_PATH,
        json={
            "orientation_type": OrientationType.social,
            "notebook_id": str(notebook_sophie_tifour.id),
            "beneficiary_id": str(beneficiary_sophie_tifour.id),
            "structure_id": str(professional_pierre_chevalier.structure_id),
        },
        headers={"jwt-token": f"{guilia_diaby_jwt}"},
    )
    assert response.status_code == 200


@mock.patch("api.core.emails.send_mail")
async def test_change_orientation_with_orientation_request(
    _: mock.Mock,
    test_client: TestClient,
    professional_pierre_chevalier: Professional,
    beneficiary_jennings_dee: Beneficiary,
    notebook_jennings_dee: Notebook,
    orientation_request_jennings_dee: OrientationRequest,
    guilia_diaby_jwt: str,
    db_connection: Connection,
):
    response = test_client.post(
        ENDPOINT_PATH,
        json={
            "orientation_request_id": str(orientation_request_jennings_dee.id),
            "orientation_type": OrientationType.social,
            "notebook_id": str(notebook_jennings_dee.id),
            "beneficiary_id": str(beneficiary_jennings_dee.id),
            "structure_id": str(professional_pierre_chevalier.structure_id),
            "professional_account_id": str(professional_pierre_chevalier.account_id),
        },
        headers={"jwt-token": f"{guilia_diaby_jwt}"},
    )

    orientation_request = await get_orientation_request_by_id(
        db_connection, orientation_request_jennings_dee.id
    )

    assert orientation_request is not None
    assert orientation_request.decided_at is not None
    assert orientation_request.decided_orientation_type_id == OrientationType.social
    assert orientation_request.status == "accepted"

    assert response.status_code == 200


@mock.patch("api.core.emails.send_mail")
async def test_send_email_to_members_with_orientation_request(
    mock_send_email: mock.Mock,
    snapshot,
    test_client: TestClient,
    professional_paul_camara: Professional,
    professional_edith_orial: Professional,
    beneficiary_jennings_dee: Beneficiary,
    notebook_jennings_dee: Notebook,
    orientation_request_jennings_dee: OrientationRequest,
    guilia_diaby_jwt: str,
):
    response = test_client.post(
        ENDPOINT_PATH,
        json={
            "orientation_type": OrientationType.social,
            "notebook_id": str(notebook_jennings_dee.id),
            "beneficiary_id": str(beneficiary_jennings_dee.id),
            "structure_id": str(professional_paul_camara.structure_id),
            "professional_account_id": str(professional_paul_camara.account_id),
            "orientation_request_id": str(orientation_request_jennings_dee.id),
        },
        headers={"jwt-token": f"{guilia_diaby_jwt}"},
    )
    assert response.status_code == 200
    assert mock_send_email.call_count == 2

    former_email_referent = mock_send_email.call_args_list[0]
    assert former_email_referent.kwargs["to"] == professional_edith_orial.email
    assert former_email_referent.kwargs["subject"] == "Réorientation d’un bénéficiaire"

    email_new_referent = mock_send_email.call_args_list[1]
    assert email_new_referent.kwargs["to"] == professional_paul_camara.email
    assert email_new_referent.kwargs["subject"] == "Réorientation d’un bénéficiaire"

    assert snapshot == {
        "former_email_referent": former_email_referent.kwargs["message"],
        "email_new_referent": email_new_referent.kwargs["message"],
    }


@mock.patch("api.core.emails.send_mail")
async def test_send_email_to_members_without_orientation_request(
    mock_send_email: mock.Mock,
    snapshot,
    test_client: TestClient,
    professional_paul_camara: Professional,
    professional_pierre_chevalier: Professional,
    beneficiary_sophie_tifour: Beneficiary,
    notebook_sophie_tifour: Notebook,
    guilia_diaby_jwt: str,
):
    response = test_client.post(
        ENDPOINT_PATH,
        json={
            "orientation_type": OrientationType.social,
            "notebook_id": str(notebook_sophie_tifour.id),
            "beneficiary_id": str(beneficiary_sophie_tifour.id),
            "structure_id": str(professional_paul_camara.structure_id),
            "professional_account_id": str(professional_paul_camara.account_id),
        },
        headers={"jwt-token": f"{guilia_diaby_jwt}"},
    )
    assert response.status_code == 200
    assert mock_send_email.call_count == 2

    former_email_referent = mock_send_email.call_args_list[0]
    assert former_email_referent.kwargs["to"] == professional_pierre_chevalier.email
    assert former_email_referent.kwargs["subject"] == "Réorientation d’un bénéficiaire"

    email_new_referent = mock_send_email.call_args_list[1]
    assert email_new_referent.kwargs["to"] == professional_paul_camara.email
    assert email_new_referent.kwargs["subject"] == "Réorientation d’un bénéficiaire"

    assert snapshot == {
        "former_email_referent": former_email_referent.kwargs["message"],
        "email_new_referent": email_new_referent.kwargs["message"],
    }


@mock.patch("api.core.emails.send_mail")
async def test_send_email_to_members_first_orientation(
    mock_send_email: mock.Mock,
    test_client: TestClient,
    snapshot,
    professional_paul_camara: Professional,
    beneficiary_noel_keller: Beneficiary,
    notebook_noel_keller: Beneficiary,
    guilia_diaby_jwt: str,
):
    response = test_client.post(
        ENDPOINT_PATH,
        json={
            "orientation_type": OrientationType.social,
            "notebook_id": str(notebook_noel_keller.id),
            "beneficiary_id": str(beneficiary_noel_keller.id),
            "structure_id": str(professional_paul_camara.structure_id),
            "professional_account_id": str(professional_paul_camara.account_id),
        },
        headers={"jwt-token": f"{guilia_diaby_jwt}"},
    )
    assert response.status_code == 200
    assert mock_send_email.call_count == 1

    email_new_referent = mock_send_email.call_args_list[0]
    assert email_new_referent.kwargs["to"] == professional_paul_camara.email
    assert email_new_referent.kwargs["subject"] == "Orientation d’un bénéficiaire"
    assert snapshot == {"email_new_referent": email_new_referent.kwargs["message"]}


@mock.patch("api.core.emails.send_mail")
async def test_unallowed_orientation_request(
    _: mock.Mock,
    test_client: TestClient,
    professional_paul_camara: Professional,
    notebook_sophie_tifour: Notebook,
    beneficiary_sophie_tifour: Beneficiary,
    orientation_request_jennings_dee: OrientationRequest,
    guilia_diaby_jwt: str,
):
    response = test_client.post(
        ENDPOINT_PATH,
        json={
            "orientation_type": OrientationType.social,
            "notebook_id": str(notebook_sophie_tifour.id),
            "beneficiary_id": str(beneficiary_sophie_tifour.id),
            "structure_id": str(professional_paul_camara.structure_id),
            "orientation_request_id": str(orientation_request_jennings_dee.id),
        },
        headers={"jwt-token": f"{guilia_diaby_jwt}"},
    )

    assert response.status_code == 403
