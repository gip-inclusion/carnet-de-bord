import json
from datetime import date
from typing import List

from pydantic import BaseModel

from api.db.crud.beneficiary import get_beneficiary_from_personal_information
from api.db.models.beneficiary import BeneficiaryImport


async def test_import_beneficiaries(
    test_client,
    get_manager_jwt,
):
    response = test_client.post(
        "/v1/beneficiaries/bulk",
        headers={"jwt-token": f"{get_manager_jwt}"},
        data=json.dumps([]),
    )
    assert response.ok


async def test_import_a_new_beneficiary(
    test_client,
    get_manager_jwt,
    db_connection,
):
    response = test_client.post(
        "/v1/beneficiaries/bulk",
        headers={"jwt-token": f"{get_manager_jwt}"},
        data=ListOf.parse_obj([harry_covert]).json(),
    )
    beneficiary_in_db = await get_beneficiary_from_personal_information(
        db_connection, "Harry", "Covert", date(1985, 7, 23)
    )
    assert response.ok
    assert beneficiary_in_db


async def test_update_existing_beneficiary_same_name(
    test_client,
    get_manager_jwt,
    db_connection,
):
    test_client.post(
        "/v1/beneficiaries/bulk",
        headers={"jwt-token": f"{get_manager_jwt}"},
        data=ListOf.parse_obj([harry_covert_phoneless]).json(),
    )
    beneficiary_in_db = await get_beneficiary_from_personal_information(
        db_connection, "Harry", "Covert", date(1985, 7, 23)
    )
    assert beneficiary_in_db.mobile_number == None
    test_client.post(
        "/v1/beneficiaries/bulk",
        headers={"jwt-token": f"{get_manager_jwt}"},
        data=ListOf.parse_obj([harry_covert]).json(),
    )
    beneficiary_in_db = await get_beneficiary_from_personal_information(
        db_connection, "Harry", "Covert", date(1985, 7, 23)
    )
    assert beneficiary_in_db.mobile_number == harry_covert.phone_number


async def test_update_existing_beneficiary_same_si_id(
    test_client,
    get_manager_jwt,
    db_connection,
):
    test_client.post(
        "/v1/beneficiaries/bulk",
        headers={"jwt-token": f"{get_manager_jwt}"},
        data=ListOf.parse_obj([harry_covert_phoneless]).json(),
    )
    beneficiary_in_db = await get_beneficiary_from_personal_information(
        db_connection, "Harry", "Covert", date(1985, 7, 23)
    )
    assert beneficiary_in_db.mobile_number == None
    test_client.post(
        "/v1/beneficiaries/bulk",
        headers={"jwt-token": f"{get_manager_jwt}"},
        data=ListOf.parse_obj([harry_covert_typo]).json(),
    )
    beneficiary_in_db = await get_beneficiary_from_personal_information(
        db_connection, "Harry", "Covert", date(1985, 7, 23)
    )
    assert beneficiary_in_db.mobile_number == harry_covert.phone_number


class ListOf(BaseModel):
    __root__: List[BeneficiaryImport]


harry_covert = BeneficiaryImport(
    si_id="123",
    firstname="Harry",
    lastname="Covert",
    date_of_birth=date(1985, 7, 23),
    phone_number="06579123",
)

harry_covert_phoneless = BeneficiaryImport(
    si_id="123",
    firstname="Harry",
    lastname="Covert",
    date_of_birth=date(1985, 7, 23),
)

harry_covert_typo = BeneficiaryImport(
    si_id="123",
    firstname="Harry,",
    lastname="Covert",
    date_of_birth=date(1985, 7, 23),
    phone_number="06579123",
)
