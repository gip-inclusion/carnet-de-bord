from unittest import mock

import pytest
from asyncpg.connection import Connection
from fastapi.testclient import TestClient

from cdb.api.db.crud.beneficiary import get_structures_for_beneficiary
from cdb.api.db.crud.notebook import get_notebook_members_by_notebook_id
from cdb.api.db.models.notebook import Notebook
from cdb.api.db.models.professional import Professional
from tests.utils.assert_helpers import assert_member, assert_structure

pytestmark = pytest.mark.graphql


@mock.patch("cdb.api.core.emails.send_mail")
async def test_verify_no_token(
    _: mock.Mock,
    test_client: TestClient,
    notebook_sophie_tifour: Notebook,
):
    response = await test_client.post(
        f"/v1/notebooks/{notebook_sophie_tifour.id}/members",
    )
    assert response.status_code == 401
    json = response.json()
    assert json["detail"] == "Missing credentials"


@mock.patch("cdb.api.core.emails.send_mail")
async def test_orientation_manager_not_allowed_to_add_notebook_member(
    _: mock.Mock,
    test_client: TestClient,
    giulia_diaby_jwt: str,
    notebook_sophie_tifour: Notebook,
):
    response = await test_client.post(
        f"/v1/notebooks/{notebook_sophie_tifour.id}/members",
        headers={"jwt-token": giulia_diaby_jwt},
    )
    assert response.status_code == 403
    json = response.json()
    assert json["detail"] == "Operation forbidden to the given role"


@mock.patch("cdb.api.core.emails.send_mail")
async def test_add_notebook_member_as_no_referent_with_no_structure_id_in_token(
    _: mock.Mock,
    test_client: TestClient,
    notebook_sophie_tifour: Notebook,
    get_professional_jwt_without_structure_id: str,
):
    response = await test_client.post(
        f"/v1/notebooks/{str(notebook_sophie_tifour.id)}/members",
        json={"member_type": "no_referent"},
        headers={"jwt-token": f"{get_professional_jwt_without_structure_id}"},
    )
    assert response.status_code == 403
    json = response.json()
    assert json["detail"] == "Unsufficient permission (structureId is missing)"


@mock.patch("cdb.api.core.emails.send_mail")
async def test_add_notebook_member_as_no_referent(
    mock_send_email: mock.Mock,
    test_client: TestClient,
    notebook_sophie_tifour: Notebook,
    get_professional_paul_camara_jwt: str,
    professional_paul_camara: Professional,
    professional_pierre_chevalier: Professional,
    db_connection: Connection,
):
    response = await test_client.post(
        f"/v1/notebooks/{notebook_sophie_tifour.id}/members",
        json={"member_type": "no_referent"},
        headers={"jwt-token": get_professional_paul_camara_jwt},
    )
    assert response.status_code == 204
    members = await get_notebook_members_by_notebook_id(
        db_connection,
        notebook_sophie_tifour.id,
    )
    structures = await get_structures_for_beneficiary(
        db_connection,
        notebook_sophie_tifour.beneficiary_id,
    )
    # Check that a new member was added
    assert_member(members, professional_paul_camara, "no_referent", True)

    # Check that beneficiary_structure has not changed
    assert_structure(
        structures,
        beneficiary_status="current",
        structure_name="Centre Communal d'action social Livry-Gargan",
    )
    mock_send_email.assert_not_called()
    # Check that former referent is still the referent
    assert_member(members, professional_pierre_chevalier, "referent", True)


@mock.patch("cdb.api.core.emails.send_mail")
async def test_add_notebook_member_as_referent(
    mock_send_email: mock.Mock,
    snapshot,
    test_client: TestClient,
    notebook_sophie_tifour: Notebook,
    get_professional_paul_camara_jwt: str,
    professional_paul_camara: Professional,
    professional_pierre_chevalier: Professional,
    db_connection: Connection,
):
    response = await test_client.post(
        f"/v1/notebooks/{notebook_sophie_tifour.id}/members",
        json={"member_type": "referent"},
        headers={"jwt-token": get_professional_paul_camara_jwt},
    )
    assert response.status_code == 204
    members = await get_notebook_members_by_notebook_id(
        db_connection,
        notebook_sophie_tifour.id,
    )

    # Check that a new member was added
    assert_member(members, professional_paul_camara, "referent", True)
    # Check that former referent has been deactivated
    assert_member(members, professional_pierre_chevalier, "referent", False)
    # Check that former referent is still an active member
    assert_member(members, professional_pierre_chevalier, "no_referent", True)
    # Check that an email is sent to former referent
    email_former_referent = mock_send_email.call_args_list[0]
    assert snapshot == email_former_referent

    structures = await get_structures_for_beneficiary(
        db_connection,
        notebook_sophie_tifour.beneficiary_id,
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
