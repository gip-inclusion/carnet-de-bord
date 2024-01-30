from unittest import mock
from uuid import UUID

import pytest
from asyncpg.connection import Connection
from gql.client import AsyncClientSession
from httpx import AsyncClient

from cdb.api.db.crud.beneficiary import get_structures_for_beneficiary
from cdb.api.db.crud.notebook import get_notebook_members_by_notebook_id
from cdb.api.db.crud.notebook_event import notebook_events_by_notebook_id
from cdb.api.db.crud.notebook_info import get_notebook_info
from cdb.api.db.crud.orientation_request import get_orientation_request_by_id
from cdb.api.db.models.beneficiary import Beneficiary
from cdb.api.db.models.notebook import Notebook
from cdb.api.db.models.orientation_request import OrientationRequest
from cdb.api.db.models.professional import Professional
from tests.utils.approvaltests import verify_as_json
from tests.utils.assert_helpers import assert_member, assert_structure

pytestmark = pytest.mark.graphql

UPDATE_ORIENTATION_ENDPOINT_PATH = "/v1/orientations/change"


@mock.patch("cdb.api.core.emails.send_mail")
async def test_verify_no_token(
    _: mock.Mock,
    test_client: AsyncClient,
    professional_pierre_chevalier: Professional,
    notebook_sophie_tifour: Notebook,
    orientation_system_social_id: UUID,
):
    response = await test_client.post(
        UPDATE_ORIENTATION_ENDPOINT_PATH,
        json={
            "orientation_system_id": str(orientation_system_social_id),
            "notebook_id": notebook_sophie_tifour.id,
            "structure_id": professional_pierre_chevalier.structure_id,
            "new_referent_account_id": professional_pierre_chevalier.account_id,
        },
    )
    assert response.status_code == 401
    json = response.json()
    assert json["detail"] == "Missing credentials"


@mock.patch("cdb.api.core.emails.send_mail")
async def test_professional_not_allowed_to_change_orientation(
    _: mock.Mock,
    test_client: AsyncClient,
    professional_pierre_chevalier: Professional,
    notebook_sophie_tifour: Notebook,
    get_professional_jwt: str,
    orientation_system_social_id: UUID,
):
    response = await test_client.post(
        UPDATE_ORIENTATION_ENDPOINT_PATH,
        json={
            "orientation_system_id": str(orientation_system_social_id),
            "notebook_id": notebook_sophie_tifour.id,
            "structure_id": professional_pierre_chevalier.structure_id,
            "new_referent_account_id": professional_pierre_chevalier.account_id,
        },
        headers={"Authorization": "Bearer " + get_professional_jwt},
    )
    assert response.status_code == 403
    json = response.json()
    assert json["detail"] == "Operation forbidden to the given role"


@mock.patch("cdb.api.core.emails.send_mail")
async def test_admin_structure_not_allowed_to_change_orientation(
    _: mock.Mock,
    test_client: AsyncClient,
    professional_pierre_chevalier: Professional,
    notebook_sophie_tifour: Notebook,
    get_admin_structure_jwt: str,
    orientation_system_social_id: UUID,
):
    response = await test_client.post(
        UPDATE_ORIENTATION_ENDPOINT_PATH,
        json={
            "orientation_system_id": str(orientation_system_social_id),
            "notebook_id": notebook_sophie_tifour.id,
            "structure_id": professional_pierre_chevalier.structure_id,
            "new_referent_account_id": professional_pierre_chevalier.account_id,
        },
        headers={"Authorization": "Bearer " + get_admin_structure_jwt},
    )
    assert response.status_code == 403
    json = response.json()
    assert json["detail"] == "Operation forbidden to the given role"


@mock.patch("cdb.api.core.emails.send_mail")
async def test_change_orientation_while_keeping_same_referent(
    _: mock.Mock,
    test_client: AsyncClient,
    professional_pierre_chevalier: Professional,
    notebook_sophie_tifour: Notebook,
    giulia_diaby_jwt: str,
    db_connection: Connection,
    orientation_system_social_id: UUID,
):
    orientation_reason = "Motif de l’orientation."
    response = await test_client.post(
        UPDATE_ORIENTATION_ENDPOINT_PATH,
        json={
            "orientation_system_id": str(orientation_system_social_id),
            "notebook_id": notebook_sophie_tifour.id,
            "structure_id": professional_pierre_chevalier.structure_id,
            "new_referent_account_id": professional_pierre_chevalier.account_id,
            "orientation_reason": orientation_reason,
        },
        headers={"Authorization": "Bearer " + giulia_diaby_jwt},
    )
    assert response.status_code == 200
    members = await get_notebook_members_by_notebook_id(
        db_connection,
        notebook_sophie_tifour.id,
    )
    notebook_info = await get_notebook_info(
        db_connection,
        notebook_sophie_tifour.id,
    )

    # Check that no new member row was added since referent doesn't change
    assert_member(members, professional_pierre_chevalier)
    notebook_info = await get_notebook_info(db_connection, notebook_sophie_tifour.id)
    assert notebook_info
    assert notebook_info.orientation_reason == orientation_reason


@mock.patch("cdb.api.core.emails.send_mail")
async def test_change_orientation_assign_to_structure_not_referent(
    _: mock.Mock,
    test_client: AsyncClient,
    professional_paul_camara: Professional,
    beneficiary_sophie_tifour: Beneficiary,
    notebook_sophie_tifour: Notebook,
    giulia_diaby_jwt: str,
    db_connection: Connection,
    orientation_system_social_id: UUID,
):
    orientation_reason = "Motif de l’orientation."
    response = await test_client.post(
        UPDATE_ORIENTATION_ENDPOINT_PATH,
        json={
            "orientation_system_id": str(orientation_system_social_id),
            "notebook_id": notebook_sophie_tifour.id,
            "structure_id": professional_paul_camara.structure_id,
            "new_referent_account_id": None,
            "orientation_reason": orientation_reason,
        },
        headers={"Authorization": "Bearer " + giulia_diaby_jwt},
    )
    assert response.status_code == 200
    members = await get_notebook_members_by_notebook_id(
        db_connection,
        notebook_sophie_tifour.id,
    )

    # Check that former referent is no longer active
    assert (
        len(
            [
                member
                for member in members
                if member.member_type == "referent" and member.active
            ]
        )
        == 0
    )
    structures = await get_structures_for_beneficiary(
        db_connection,
        beneficiary_sophie_tifour.id,
    )
    # Check that former structure has been set as 'outdated'
    assert_structure(
        structures,
        beneficiary_status="outdated",
        structure_name="Centre Communal d'action social Livry-Gargan",
    )

    # Check that new structure has been added as 'current'
    assert_structure(
        structures,
        beneficiary_status="current",
        structure_name="Service Social Départemental",
    )
    notebook_info = await get_notebook_info(db_connection, notebook_sophie_tifour.id)
    assert notebook_info
    assert notebook_info.orientation_reason == orientation_reason


@mock.patch("cdb.api.core.emails.send_mail")
async def test_change_orientation_with_new_referent(
    _: mock.Mock,
    test_client: AsyncClient,
    professional_paul_camara: Professional,
    professional_pierre_chevalier: Professional,
    beneficiary_sophie_tifour: Beneficiary,
    notebook_sophie_tifour: Notebook,
    giulia_diaby_jwt: str,
    db_connection: Connection,
    gql_admin_client: AsyncClientSession,
    orientation_system_social_id: UUID,
):
    orientation_reason = "Motif de l’orientation."
    response = await test_client.post(
        UPDATE_ORIENTATION_ENDPOINT_PATH,
        json={
            "orientation_system_id": str(orientation_system_social_id),
            "notebook_id": notebook_sophie_tifour.id,
            "structure_id": professional_paul_camara.structure_id,
            "new_referent_account_id": professional_paul_camara.account_id,
            "orientation_reason": orientation_reason,
        },
        headers={"Authorization": "Bearer " + giulia_diaby_jwt},
    )
    assert response.status_code == 200
    members = await get_notebook_members_by_notebook_id(
        db_connection,
        notebook_sophie_tifour.id,
    )

    # Check that former referent is no longer active
    assert_member(
        members, professional_pierre_chevalier, member_type="referent", active=False
    )

    # Check that former referent remains in the notebook as simple member
    assert_member(
        members, professional_pierre_chevalier, member_type="no_referent", active=True
    )

    # Check that new referent is in the notebook as referent
    assert_member(
        members, professional_paul_camara, member_type="referent", active=True
    )

    structures = await get_structures_for_beneficiary(
        db_connection,
        beneficiary_sophie_tifour.id,
    )
    # Check that former structure has been set as 'outdated'
    assert_structure(
        structures,
        beneficiary_status="outdated",
        structure_name="Centre Communal d'action social Livry-Gargan",
    )

    # Check that new structure has been added as 'current'
    assert_structure(
        structures,
        beneficiary_status="current",
        structure_name="Service Social Départemental",
    )
    notebook_info = await get_notebook_info(db_connection, notebook_sophie_tifour.id)
    assert notebook_info
    assert notebook_info.orientation_reason == orientation_reason

    result = await gql_admin_client.execute(
        notebook_events_by_notebook_id,
        variable_values={"notebook_id": notebook_sophie_tifour.id},
    )
    assert result["notebook_event"]
    [orientation_event] = [
        event
        for event in result["notebook_event"]
        if event["eventType"] == "orientation"
    ]
    verify_as_json(orientation_event)


@mock.patch("cdb.api.core.emails.send_mail")
async def test_change_orientation_with_new_referent_when_beneficiary_has_no_structure(
    _: mock.Mock,
    test_client: AsyncClient,
    professional_paul_camara: Professional,
    beneficiary_sophie_tifour: Beneficiary,
    notebook_craig_reilly: Notebook,
    samy_rouate_jwt: str,
    db_connection: Connection,
    orientation_system_social_id: UUID,
):
    response = await test_client.post(
        UPDATE_ORIENTATION_ENDPOINT_PATH,
        json={
            "orientation_system_id": str(orientation_system_social_id),
            "notebook_id": notebook_craig_reilly.id,
            "structure_id": professional_paul_camara.structure_id,
            "new_referent_account_id": professional_paul_camara.account_id,
        },
        headers={"Authorization": "Bearer " + samy_rouate_jwt},
    )
    assert response.status_code == 200
    members = await get_notebook_members_by_notebook_id(
        db_connection,
        notebook_craig_reilly.id,
    )

    # Check that new referent is in the notebook as referent
    assert_member(
        members, professional_paul_camara, member_type="referent", active=True
    )

    structures = await get_structures_for_beneficiary(
        db_connection,
        beneficiary_sophie_tifour.id,
    )

    # Check that new structure has been added as 'current'
    assert_structure(
        structures,
        beneficiary_status="current",
        structure_name="Centre Communal d'action social Livry-Gargan",
    )


@mock.patch("cdb.api.core.emails.send_mail")
async def test_change_orientation_with_orientation_request(
    _: mock.Mock,
    test_client: AsyncClient,
    professional_pierre_chevalier: Professional,
    notebook_jennings_dee: Notebook,
    orientation_request_jennings_dee: OrientationRequest,
    giulia_diaby_jwt: str,
    db_connection: Connection,
    orientation_system_social_id: UUID,
):
    response = await test_client.post(
        UPDATE_ORIENTATION_ENDPOINT_PATH,
        json={
            "orientation_request_id": orientation_request_jennings_dee.id,
            "orientation_system_id": str(orientation_system_social_id),
            "notebook_id": notebook_jennings_dee.id,
            "structure_id": professional_pierre_chevalier.structure_id,
            "new_referent_account_id": professional_pierre_chevalier.account_id,
        },
        headers={"Authorization": "Bearer " + giulia_diaby_jwt},
    )

    orientation_request = await get_orientation_request_by_id(
        db_connection, orientation_request_jennings_dee.id
    )

    assert orientation_request is not None
    assert orientation_request.decided_at is not None
    assert (
        orientation_request.decided_orientation_system_id
        == orientation_system_social_id
    )
    assert orientation_request.status == "accepted"

    assert response.status_code == 200


@mock.patch("cdb.api.core.emails.send_mail")
async def test_send_email_to_members_with_orientation_request(
    mock_send_email: mock.Mock,
    test_client: AsyncClient,
    professional_paul_camara: Professional,
    professional_edith_orial: Professional,
    notebook_jennings_dee: Notebook,
    orientation_request_jennings_dee: OrientationRequest,
    giulia_diaby_jwt: str,
    orientation_system_social_id: UUID,
):
    response = await test_client.post(
        UPDATE_ORIENTATION_ENDPOINT_PATH,
        json={
            "orientation_system_id": str(orientation_system_social_id),
            "notebook_id": notebook_jennings_dee.id,
            "structure_id": professional_paul_camara.structure_id,
            "new_referent_account_id": professional_paul_camara.account_id,
            "orientation_request_id": orientation_request_jennings_dee.id,
        },
        headers={"Authorization": "Bearer " + giulia_diaby_jwt},
    )
    assert response.status_code == 200
    assert mock_send_email.call_count == 0


@mock.patch("cdb.api.core.emails.send_mail")
async def test_send_email_to_members_without_orientation_request(
    mock_send_email: mock.Mock,
    test_client: AsyncClient,
    professional_paul_camara: Professional,
    professional_pierre_chevalier: Professional,
    notebook_sophie_tifour: Notebook,
    giulia_diaby_jwt: str,
    orientation_system_social_id: UUID,
):
    response = await test_client.post(
        UPDATE_ORIENTATION_ENDPOINT_PATH,
        json={
            "orientation_system_id": str(orientation_system_social_id),
            "notebook_id": notebook_sophie_tifour.id,
            "structure_id": professional_paul_camara.structure_id,
            "new_referent_account_id": professional_paul_camara.account_id,
        },
        headers={"Authorization": "Bearer " + giulia_diaby_jwt},
    )
    assert response.status_code == 200
    assert mock_send_email.call_count == 0


@mock.patch("cdb.api.core.emails.send_mail")
async def test_send_email_to_members_first_orientation(
    mock_send_email: mock.Mock,
    test_client: AsyncClient,
    professional_paul_camara: Professional,
    notebook_noel_keller: Beneficiary,
    giulia_diaby_jwt: str,
    orientation_system_social_id: UUID,
):
    response = await test_client.post(
        UPDATE_ORIENTATION_ENDPOINT_PATH,
        json={
            "orientation_system_id": str(orientation_system_social_id),
            "notebook_id": notebook_noel_keller.id,
            "structure_id": professional_paul_camara.structure_id,
            "new_referent_account_id": professional_paul_camara.account_id,
        },
        headers={"Authorization": "Bearer " + giulia_diaby_jwt},
    )
    assert response.status_code == 200
    assert mock_send_email.call_count == 0


@mock.patch("cdb.api.core.emails.send_mail")
async def test_unconsistent_orientation_request(
    _: mock.Mock,
    test_client: AsyncClient,
    professional_paul_camara: Professional,
    notebook_sophie_tifour: Notebook,
    orientation_request_jennings_dee: OrientationRequest,
    giulia_diaby_jwt: str,
    orientation_system_social_id: UUID,
):
    response = await test_client.post(
        UPDATE_ORIENTATION_ENDPOINT_PATH,
        json={
            "orientation_system_id": str(orientation_system_social_id),
            "notebook_id": notebook_sophie_tifour.id,
            "structure_id": professional_paul_camara.structure_id,
            "orientation_request_id": orientation_request_jennings_dee.id,
        },
        headers={"Authorization": "Bearer " + giulia_diaby_jwt},
    )

    assert response.status_code == 400


@mock.patch("cdb.api.core.emails.send_mail")
async def test_set_orientation_reason_to_null_when_not_defined(
    _: mock.Mock,
    test_client: AsyncClient,
    professional_pierre_chevalier: Professional,
    notebook_sophie_tifour: Notebook,
    giulia_diaby_jwt: str,
    db_connection: Connection,
    orientation_system_social_id: UUID,
):
    response = await test_client.post(
        UPDATE_ORIENTATION_ENDPOINT_PATH,
        json={
            "orientation_system_id": str(orientation_system_social_id),
            "notebook_id": notebook_sophie_tifour.id,
            "structure_id": professional_pierre_chevalier.structure_id,
            "new_referent_account_id": professional_pierre_chevalier.account_id,
        },
        headers={"Authorization": "Bearer " + giulia_diaby_jwt},
    )
    assert response.status_code == 200
    notebook_info = await get_notebook_info(db_connection, notebook_sophie_tifour.id)
    assert notebook_info.orientation_reason is None
