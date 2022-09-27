from datetime import date
from typing import List

from pydantic import BaseModel

from api.db.crud.beneficiary import get_beneficiary_from_personal_information
from api.db.models.beneficiary import BeneficiaryImport


async def post(client, token, beneficiaries):
    return client.post(
        "/v1/beneficiaries/bulk",
        headers={"jwt-token": f"{token}"},
        data=ListOf.parse_obj(beneficiaries).json(),
    )


async def test_import_beneficiaries(
    test_client,
    get_manager_jwt,
):
    response = await post(test_client, get_manager_jwt, [])
    assert response.ok


async def test_import_a_new_beneficiary(
    test_client,
    get_manager_jwt,
    db_connection,
):
    response = await post(test_client, get_manager_jwt, [harry_covert])
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
    await post(test_client, get_manager_jwt, [harry_covert_phoneless])

    beneficiary_in_db = await get_beneficiary_from_personal_information(
        db_connection, "Harry", "Covert", date(1985, 7, 23)
    )
    assert beneficiary_in_db.mobile_number == None

    await post(test_client, get_manager_jwt, [harry_covert])

    beneficiary_in_db = await get_beneficiary_from_personal_information(
        db_connection, "Harry", "Covert", date(1985, 7, 23)
    )
    assert beneficiary_in_db.mobile_number == harry_covert.phone_number


async def test_do_not_update_beneficiary_with_same_si_id_but_different_name(
    test_client,
    get_manager_jwt,
    db_connection,
):
    await post(test_client, get_manager_jwt, [harry_covert_phoneless])

    beneficiary_in_db = await get_beneficiary_from_personal_information(
        db_connection, "Harry", "Covert", date(1985, 7, 23)
    )
    assert beneficiary_in_db.mobile_number is None

    await post(test_client, get_manager_jwt, [harry_covert_typo])

    beneficiary_in_db = await get_beneficiary_from_personal_information(
        db_connection, "Harry", "Covert", date(1985, 7, 23)
    )
    assert beneficiary_in_db.mobile_number is None


async def test_update_beneficiary_with_different_capitalization_and_spacing(
    test_client,
    get_manager_jwt,
    db_connection,
):
    await post(test_client, get_manager_jwt, [harry_covert_phoneless])

    await post(test_client, get_manager_jwt, [harry_covert_with_caps_and_space])

    beneficiary_in_db = await get_beneficiary_from_personal_information(
        db_connection, "Harry", "Covert", date(1985, 7, 23)
    )
    assert (
        beneficiary_in_db.mobile_number == harry_covert_with_caps_and_space.phone_number
    )


# todo test avec plein de champs
# todo test avec plusieurs beneficiaire
# todo test creation / update notebook


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

harry_covert_with_caps_and_space = BeneficiaryImport(
    si_id="123",
    firstname="Harry ",
    lastname="  CoVert",
    date_of_birth=date(1985, 7, 23),
    phone_number="06579123",
)
