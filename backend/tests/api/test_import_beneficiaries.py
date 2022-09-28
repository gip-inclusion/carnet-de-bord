from datetime import date
from typing import List

from pydantic import BaseModel

from api.db.crud.beneficiary import get_beneficiary_from_personal_information
from api.db.models.beneficiary import BeneficiaryImport


async def post(client, token: str, beneficiaries: list[BeneficiaryImport]):
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


async def test_insert_beneficiary_check_all_fields(
    test_client,
    get_manager_jwt,
    db_connection,
):
    await post(test_client, get_manager_jwt, [harry_covert])

    beneficiary_in_db = await get_beneficiary_from_personal_information(
        db_connection, "Harry", "Covert", date(1985, 7, 23)
    )
    assert beneficiary_in_db.firstname == harry_covert.firstname
    assert beneficiary_in_db.lastname == harry_covert.lastname
    assert beneficiary_in_db.date_of_birth == harry_covert.date_of_birth
    assert beneficiary_in_db.internal_id == harry_covert.si_id
    assert beneficiary_in_db.place_of_birth == harry_covert.place_of_birth
    assert beneficiary_in_db.mobile_number == harry_covert.phone_number
    assert beneficiary_in_db.email == harry_covert.email
    assert beneficiary_in_db.address1 == harry_covert.address1
    assert beneficiary_in_db.address2 == harry_covert.address2
    assert beneficiary_in_db.postal_code == harry_covert.postal_code
    assert beneficiary_in_db.city == harry_covert.city
    #   assert beneficiary_in_db.work_situation == harry_covert.work_situation
    assert beneficiary_in_db.caf_number == harry_covert.caf_number
    assert beneficiary_in_db.pe_number == harry_covert.pe_number


#   assert beneficiary_in_db.right_rsa == harry_covert.right_rsa
#   assert beneficiary_in_db.right_are == True
#   assert beneficiary_in_db.right_ass == False
#   assert beneficiary_in_db.right_bonus == False
#   assert beneficiary_in_db.right_rqth == False
#   assert beneficiary_in_db.geographical_area == harry_covert.geographical_area
#   assert beneficiary_in_db.rome_code_description == harry_covert.rome_code_description
#   assert beneficiary_in_db.education_level == harry_covert.education_level


async def test_update_beneficiary_check_all_fields(
    test_client,
    get_manager_jwt,
    db_connection,
):
    await post(test_client, get_manager_jwt, [harry_covert_phoneless])
    await post(test_client, get_manager_jwt, [harry_covert])

    beneficiary_in_db = await get_beneficiary_from_personal_information(
        db_connection, "Harry", "Covert", date(1985, 7, 23)
    )
    assert beneficiary_in_db.mobile_number == harry_covert.phone_number
    assert beneficiary_in_db.email == harry_covert.email
    assert beneficiary_in_db.address1 == harry_covert.address1
    assert beneficiary_in_db.address2 == harry_covert.address2
    assert beneficiary_in_db.postal_code == harry_covert.postal_code
    assert beneficiary_in_db.city == harry_covert.city
    #   assert beneficiary_in_db.work_situation == harry_covert.work_situation
    assert beneficiary_in_db.caf_number == harry_covert.caf_number
    assert beneficiary_in_db.pe_number == harry_covert.pe_number


#   assert beneficiary_in_db.right_rsa == harry_covert.right_rsa
#   assert beneficiary_in_db.right_are == True
#   assert beneficiary_in_db.right_ass == False
#   assert beneficiary_in_db.right_bonus == False
#   assert beneficiary_in_db.right_rqth == False
#   assert beneficiary_in_db.geographical_area == harry_covert.geographical_area
#   assert beneficiary_in_db.rome_code_description == harry_covert.rome_code_description
#   assert beneficiary_in_db.education_level == harry_covert.education_level


async def test_import_multiple_beneficiaries(
    test_client,
    get_manager_jwt,
    db_connection,
):
    response = await post(test_client, get_manager_jwt, [harry_covert, betty_bois])
    harry_in_db = await get_beneficiary_from_personal_information(
        db_connection, "Harry", "Covert", date(1985, 7, 23)
    )
    betty_in_db = await get_beneficiary_from_personal_information(
        db_connection, "Harry", "Covert", date(1985, 7, 23)
    )
    assert response.ok
    assert harry_in_db
    assert betty_in_db


# todo test creation / update notebook


class ListOf(BaseModel):
    __root__: List[BeneficiaryImport]


harry_covert = BeneficiaryImport(
    si_id="123",
    firstname="Harry",
    lastname="Covert",
    date_of_birth=date(1985, 7, 23),
    place_of_birth="Paris",
    phone_number="06579123",
    email="harry.covert@caramail.fr",
    address1="1 Rue des Champs",
    address2="1er étage",
    postal_code="12345",
    city="Paris",
    work_situation="recherche_emploi",
    caf_number="1234567",
    pe_number="654321L",
    right_rsa="rsa_droit_ouvert_versable",
    right_are="Oui",
    right_ass="Non",
    right_bonus="Non",
    right_rqth="Non",
    geographical_area="between_20_30",
    rome_code_description="Pontier élingueur / Pontière élingueuse (N1104)",
    education_level="level_4",
    structure_name="Pôle emploi de Normandie",
    advisor_email="",
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

betty_bois = BeneficiaryImport(
    si_id="1234",
    firstname="Betty",
    lastname="Bois",
    date_of_birth=date(1970, 9, 15),
)
