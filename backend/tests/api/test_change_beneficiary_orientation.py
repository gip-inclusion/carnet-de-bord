from fastapi.testclient import TestClient

from api.db.models.beneficiary import Beneficiary
from api.db.models.notebook_info import OrientationType
from api.db.models.professional import Professional

ENDPOINT_PATH = "/v1/change-beneficiary-orientation"


async def test_verify_no_token(
    test_client: TestClient,
    professional_pierre_chevalier: Professional,
    beneficiary_sophie_tifour: Beneficiary,
):
    response = test_client.post(
        ENDPOINT_PATH,
        json={
            "orientation_type": OrientationType.social,
            "notebook_id": str(beneficiary_sophie_tifour.notebook.id),
            "beneficiary_id": str(beneficiary_sophie_tifour.id),
            "structure_id": str(professional_pierre_chevalier.structure_id),
            "professional_account_id": str(professional_pierre_chevalier.account_id),
        },
    )
    assert response.status_code == 401
    json = response.json()
    assert json["detail"] == "Missing credentials"


async def test_professional_not_allowed_to_change_orientation(
    test_client: TestClient,
    professional_pierre_chevalier: Professional,
    beneficiary_sophie_tifour: Beneficiary,
    get_professionnal_jwt: str,
):
    response = test_client.post(
        ENDPOINT_PATH,
        json={
            "orientation_type": OrientationType.social,
            "notebook_id": str(beneficiary_sophie_tifour.notebook.id),
            "beneficiary_id": str(beneficiary_sophie_tifour.id),
            "structure_id": str(professional_pierre_chevalier.structure_id),
            "professional_account_id": str(professional_pierre_chevalier.account_id),
        },
        headers={"jwt-token": f"{get_professionnal_jwt}"},
    )
    assert response.status_code == 403
    json = response.json()
    assert json["detail"] == "Operation forbidden to the given role"


async def test_change_orientation_with_exisiting_pro_in_members(
    test_client: TestClient,
    professional_pierre_chevalier: Professional,
    beneficiary_sophie_tifour: Beneficiary,
    guilia_diaby_jwt: str,
):
    response = test_client.post(
        ENDPOINT_PATH,
        json={
            "orientation_type": OrientationType.social,
            "notebook_id": str(beneficiary_sophie_tifour.notebook.id),
            "beneficiary_id": str(beneficiary_sophie_tifour.id),
            "structure_id": str(professional_pierre_chevalier.structure_id),
            "professional_account_id": str(professional_pierre_chevalier.account_id),
        },
        headers={"jwt-token": f"{guilia_diaby_jwt}"},
    )
    assert response.status_code == 200
