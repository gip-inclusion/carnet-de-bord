import json
import logging
from datetime import date
from typing import List

from pydantic import BaseModel

from api.db.crud.beneficiary import (
    get_beneficiary_from_personal_information,
    get_structures_for_beneficiary,
)
from api.db.crud.professional import get_professional_by_email
from api.db.crud.rome_code import get_rome_code_by_id
from api.db.models.beneficiary import Beneficiary, BeneficiaryImport


async def import_beneficiaries(
    client, token: str, beneficiaries: list[BeneficiaryImport]
):
    return client.post(
        "/v1/beneficiaries/bulk",
        headers={"jwt-token": f"{token}"},
        data=json.dumps(
            {
                "need_orientation": True,
                "beneficiaries": [benef.dict() for benef in beneficiaries],
            },
            default=str,
        ),
    )


async def test_import_beneficiaries_must_be_done_by_a_manager(
    test_client,
    get_professionnal_jwt,
):
    response = test_client.post(
        "/v1/beneficiaries/bulk",
        headers={"jwt-token": f"{get_professionnal_jwt}"},
        data=json.dumps(
            {
                "beneficiaries": [],
                "need_orientation": True,
            },
            default=str,
        ),
    )
    assert response.status_code == 400


async def test_import_beneficiaries(
    test_client,
    get_manager_jwt,
):
    response = await import_beneficiaries(test_client, get_manager_jwt, [])
    assert response.ok


async def test_import_a_new_beneficiary(
    test_client,
    get_manager_jwt,
    db_connection,
):
    response = await import_beneficiaries(test_client, get_manager_jwt, [harry_covert])
    beneficiary_in_db = await get_beneficiary_from_personal_information(
        db_connection, "Harry", "Covert", date(1985, 7, 23)
    )
    assert response.ok
    assert beneficiary_in_db


async def test_update_existing_beneficiary_same_name(
    test_client, get_manager_jwt, db_connection, caplog
):
    await import_beneficiaries(test_client, get_manager_jwt, [harry_covert_phoneless])

    beneficiary_in_db: Beneficiary = await get_beneficiary_from_personal_information(
        db_connection, "Harry", "Covert", date(1985, 7, 23)
    )
    assert beneficiary_in_db.mobile_number == None

    await import_beneficiaries(test_client, get_manager_jwt, [harry_covert])

    beneficiary_in_db: Beneficiary = await get_beneficiary_from_personal_information(
        db_connection, "Harry", "Covert", date(1985, 7, 23)
    )
    assert beneficiary_in_db.mobile_number == harry_covert.mobile_number


async def test_do_not_update_beneficiary_with_same_si_id_but_different_name(
    test_client,
    get_manager_jwt,
    db_connection,
):
    await import_beneficiaries(test_client, get_manager_jwt, [harry_covert_phoneless])

    beneficiary_in_db = await get_beneficiary_from_personal_information(
        db_connection, "Harry", "Covert", date(1985, 7, 23)
    )
    assert beneficiary_in_db.mobile_number is None

    response = await import_beneficiaries(
        test_client, get_manager_jwt, [harry_covert_typo]
    )

    beneficiary_in_db = await get_beneficiary_from_personal_information(
        db_connection, "Harry", "Covert", date(1985, 7, 23)
    )
    assert beneficiary_in_db.mobile_number is None
    assert (
        response.json()[0]["errors"][0]["error"]
        == "Un bénéficiaire existe déjà avec cet identifiant SI sur le territoire."
    )


async def test_update_beneficiary_with_different_capitalization_and_spacing(
    test_client, get_manager_jwt, db_connection, caplog
):

    with caplog.at_level(logging.INFO):
        await import_beneficiaries(
            test_client, get_manager_jwt, [sophie_tifour_bad_caps]
        )

        beneficiary_in_db: Beneficiary | None = (
            await get_beneficiary_from_personal_information(
                db_connection, "Sophie", "Tifour", date(1982, 2, 1)
            )
        )

        assert "updated existing beneficiary" in caplog.text
        assert beneficiary_in_db is not None
        assert beneficiary_in_db.internal_id == sophie_tifour_bad_caps.internal_id


async def test_insert_beneficiary_check_all_fields(
    test_client,
    get_manager_jwt,
    db_connection,
):
    await import_beneficiaries(test_client, get_manager_jwt, [harry_covert])

    beneficiary_in_db: Beneficiary = await get_beneficiary_from_personal_information(
        db_connection, "Harry", "Covert", date(1985, 7, 23)
    )
    assert beneficiary_in_db.firstname == harry_covert.firstname
    assert beneficiary_in_db.lastname == harry_covert.lastname
    assert beneficiary_in_db.date_of_birth == harry_covert.date_of_birth
    assert beneficiary_in_db.internal_id == harry_covert.internal_id
    assert beneficiary_in_db.place_of_birth == harry_covert.place_of_birth
    assert beneficiary_in_db.mobile_number == harry_covert.mobile_number
    assert beneficiary_in_db.email == harry_covert.email
    assert beneficiary_in_db.address1 == harry_covert.address1
    assert beneficiary_in_db.address2 == harry_covert.address2
    assert beneficiary_in_db.postal_code == harry_covert.postal_code
    assert beneficiary_in_db.city == harry_covert.city
    assert beneficiary_in_db.notebook.work_situation == harry_covert.work_situation
    assert beneficiary_in_db.caf_number == harry_covert.caf_number
    assert beneficiary_in_db.pe_number == harry_covert.pe_number
    assert beneficiary_in_db.nir == harry_covert.nir

    assert beneficiary_in_db.notebook.right_rsa == harry_covert.right_rsa
    assert beneficiary_in_db.notebook.right_are == True
    assert beneficiary_in_db.notebook.right_ass == False
    assert beneficiary_in_db.notebook.right_bonus == False
    assert beneficiary_in_db.notebook.right_rqth == False
    assert (
        beneficiary_in_db.notebook.geographical_area == harry_covert.geographical_area
    )
    assert beneficiary_in_db.notebook.education_level == harry_covert.education_level

    wanted_jobs = [
        await get_rome_code_by_id(db_connection, wj.rome_code_id)
        for wj in beneficiary_in_db.notebook.wanted_jobs
    ]
    assert harry_covert.rome_code_description in [
        rome_code.label for rome_code in wanted_jobs
    ]
    referent = await get_professional_by_email(
        db_connection, harry_covert.advisor_email
    )
    assert referent.account_id == beneficiary_in_db.notebook.members[0].account_id


async def test_update_beneficiary_check_all_fields(
    test_client,
    get_manager_jwt,
    db_connection,
):
    await import_beneficiaries(test_client, get_manager_jwt, [harry_covert_phoneless])
    await import_beneficiaries(test_client, get_manager_jwt, [harry_covert])

    beneficiary_in_db = await get_beneficiary_from_personal_information(
        db_connection, "Harry", "Covert", date(1985, 7, 23)
    )
    assert beneficiary_in_db.mobile_number == harry_covert.mobile_number
    assert beneficiary_in_db.email == harry_covert.email
    assert beneficiary_in_db.address1 == harry_covert.address1
    assert beneficiary_in_db.address2 == harry_covert.address2
    assert beneficiary_in_db.postal_code == harry_covert.postal_code
    assert beneficiary_in_db.city == harry_covert.city
    assert beneficiary_in_db.caf_number == harry_covert.caf_number
    assert beneficiary_in_db.pe_number == harry_covert.pe_number
    assert beneficiary_in_db.nir == harry_covert.nir
    assert beneficiary_in_db.notebook.work_situation == harry_covert.work_situation
    assert beneficiary_in_db.notebook.right_rsa == harry_covert.right_rsa
    assert beneficiary_in_db.notebook.right_are == True
    assert beneficiary_in_db.notebook.right_ass == False
    assert beneficiary_in_db.notebook.right_bonus == False
    assert beneficiary_in_db.notebook.right_rqth == False
    assert (
        beneficiary_in_db.notebook.geographical_area == harry_covert.geographical_area
    )
    assert beneficiary_in_db.notebook.education_level == harry_covert.education_level
    wanted_jobs = [
        await get_rome_code_by_id(db_connection, wj.rome_code_id)
        for wj in beneficiary_in_db.notebook.wanted_jobs
    ]
    assert harry_covert.rome_code_description in [
        rome_code.label for rome_code in wanted_jobs
    ]


async def test_dont_update_beneficiary_with_empty_fields(
    test_client,
    get_manager_jwt,
    db_connection,
):
    await import_beneficiaries(test_client, get_manager_jwt, [harry_covert])
    beneficiary_in_db = await get_beneficiary_from_personal_information(
        db_connection, "Harry", "Covert", date(1985, 7, 23)
    )
    await import_beneficiaries(test_client, get_manager_jwt, [harry_covert_phoneless])
    beneficiary_in_db = await get_beneficiary_from_personal_information(
        db_connection, "Harry", "Covert", date(1985, 7, 23)
    )
    assert beneficiary_in_db.mobile_number == harry_covert.mobile_number
    assert beneficiary_in_db.email == harry_covert.email
    assert beneficiary_in_db.address1 == harry_covert.address1
    assert beneficiary_in_db.address2 == harry_covert.address2
    assert beneficiary_in_db.postal_code == harry_covert.postal_code
    assert beneficiary_in_db.city == harry_covert.city
    assert beneficiary_in_db.notebook.work_situation == harry_covert.work_situation
    assert beneficiary_in_db.caf_number == harry_covert.caf_number
    assert beneficiary_in_db.pe_number == harry_covert.pe_number
    assert beneficiary_in_db.nir == harry_covert.nir
    assert beneficiary_in_db.notebook.right_rsa == harry_covert.right_rsa
    assert beneficiary_in_db.notebook.right_are == True
    assert beneficiary_in_db.notebook.right_ass == False
    assert beneficiary_in_db.notebook.right_bonus == False
    assert beneficiary_in_db.notebook.right_rqth == False
    assert (
        beneficiary_in_db.notebook.geographical_area == harry_covert.geographical_area
    )
    assert beneficiary_in_db.notebook.education_level == harry_covert.education_level


async def test_only_update_beneficiary_with_not_null_fields(
    test_client,
    get_manager_jwt,
    db_connection,
):
    await import_beneficiaries(test_client, get_manager_jwt, [harry_covert])
    beneficiary_in_db = await get_beneficiary_from_personal_information(
        db_connection, "Harry", "Covert", date(1985, 7, 23)
    )
    await import_beneficiaries(test_client, get_manager_jwt, [harry_covert_reimport])
    beneficiary_in_db = await get_beneficiary_from_personal_information(
        db_connection, "Harry", "Covert", date(1985, 7, 23)
    )
    assert beneficiary_in_db.mobile_number == harry_covert_reimport.mobile_number
    assert beneficiary_in_db.email == harry_covert_reimport.email
    assert beneficiary_in_db.address1 == harry_covert_reimport.address1
    assert beneficiary_in_db.address2 == harry_covert_reimport.address2
    assert beneficiary_in_db.postal_code == harry_covert_reimport.postal_code
    assert beneficiary_in_db.city == harry_covert_reimport.city
    assert beneficiary_in_db.nir == harry_covert_reimport.nir
    assert beneficiary_in_db.caf_number == harry_covert.caf_number
    assert beneficiary_in_db.pe_number == harry_covert.pe_number
    assert beneficiary_in_db.notebook.work_situation == harry_covert.work_situation
    assert beneficiary_in_db.notebook.right_rsa == harry_covert.right_rsa
    assert beneficiary_in_db.notebook.right_are == True
    assert beneficiary_in_db.notebook.right_ass == False
    assert beneficiary_in_db.notebook.right_bonus == False
    assert beneficiary_in_db.notebook.right_rqth == False
    assert (
        beneficiary_in_db.notebook.geographical_area == harry_covert.geographical_area
    )
    assert beneficiary_in_db.notebook.education_level == harry_covert.education_level


async def test_import_multiple_beneficiaries(
    test_client,
    get_manager_jwt,
    db_connection,
):
    response = await import_beneficiaries(
        test_client, get_manager_jwt, [harry_covert, betty_bois]
    )
    harry_in_db = await get_beneficiary_from_personal_information(
        db_connection, "Harry", "Covert", date(1985, 7, 23)
    )
    betty_in_db = await get_beneficiary_from_personal_information(
        db_connection, "Harry", "Covert", date(1985, 7, 23)
    )
    assert response.ok
    assert harry_in_db
    assert betty_in_db


async def test_import_multiple_wanted_jobs(
    test_client,
    get_manager_jwt,
    db_connection,
):
    harry_covert_wants_more = harry_covert.copy()
    harry_covert_wants_more.rome_code_description = (
        harry_covert.rome_code_description
        + ", Chauffeur / Chauffeuse de machines agricoles (A1101)"
    )
    await import_beneficiaries(test_client, get_manager_jwt, [harry_covert_wants_more])

    beneficiary_in_db = await get_beneficiary_from_personal_information(
        db_connection, "Harry", "Covert", date(1985, 7, 23)
    )

    wanted_jobs = [
        await get_rome_code_by_id(db_connection, wj.rome_code_id)
        for wj in beneficiary_in_db.notebook.wanted_jobs
    ]
    wanted_job_labels = [rome_code.label for rome_code in wanted_jobs]
    assert "Chauffeur / Chauffeuse de machines agricoles (A1101)" in wanted_job_labels
    assert "Pontier élingueur / Pontière élingueuse (N1104)" in wanted_job_labels


async def test_matched_existing_referent_and_structure(
    test_client,
    get_manager_jwt,
    db_connection,
):
    await import_beneficiaries(test_client, get_manager_jwt, [harry_covert])

    beneficiary_in_db = await get_beneficiary_from_personal_information(
        db_connection, "Harry", "Covert", date(1985, 7, 23)
    )
    associated_structures = await get_structures_for_beneficiary(
        db_connection, beneficiary_in_db.id
    )

    assert associated_structures[0].structure_name == harry_covert.structure_name
    assert associated_structures[0].beneficiary_status == "done"

    referent = await get_professional_by_email(
        db_connection, harry_covert.advisor_email
    )

    assert referent.account_id in [
        member.account_id
        for member in beneficiary_in_db.notebook.members
        if member.member_type == "referent"
    ]


async def test_existing_structure_no_referent(
    test_client,
    get_manager_jwt,
    db_connection,
):
    harry = harry_covert.copy()
    harry.advisor_email = None
    await import_beneficiaries(test_client, get_manager_jwt, [harry])

    beneficiary_in_db = await get_beneficiary_from_personal_information(
        db_connection, "Harry", "Covert", date(1985, 7, 23)
    )
    associated_structures = await get_structures_for_beneficiary(
        db_connection, beneficiary_in_db.id
    )

    assert associated_structures[0].structure_name == harry.structure_name
    assert associated_structures[0].beneficiary_status == "pending"

    assert not beneficiary_in_db.notebook.members


async def test_existing_referent_no_structure(
    test_client,
    get_manager_jwt,
    db_connection,
):
    harry = harry_covert.copy()
    harry.structure_name = None
    await import_beneficiaries(test_client, get_manager_jwt, [harry])

    beneficiary_in_db = await get_beneficiary_from_personal_information(
        db_connection, "Harry", "Covert", date(1985, 7, 23)
    )
    associated_structures = await get_structures_for_beneficiary(
        db_connection, beneficiary_in_db.id
    )
    referent = await get_professional_by_email(
        db_connection, harry_covert.advisor_email
    )

    assert associated_structures[0].structure_id == referent.structure_id
    assert associated_structures[0].beneficiary_status == "done"

    assert referent.account_id in [
        member.account_id
        for member in beneficiary_in_db.notebook.members
        if member.member_type == "referent"
    ]


async def test_existing_referent_not_in_existing_structure(
    test_client,
    get_manager_jwt,
    db_connection,
):
    harry = harry_covert.copy()
    harry.structure_name = "Service Social Départemental"
    await import_beneficiaries(test_client, get_manager_jwt, [harry])

    beneficiary_in_db = await get_beneficiary_from_personal_information(
        db_connection, "Harry", "Covert", date(1985, 7, 23)
    )
    associated_structures = await get_structures_for_beneficiary(
        db_connection, beneficiary_in_db.id
    )

    assert associated_structures[0].structure_name == harry.structure_name
    assert associated_structures[0].beneficiary_status == "pending"
    assert not beneficiary_in_db.notebook.members


async def test_non_existing_structure(
    test_client,
    get_manager_jwt,
    db_connection,
):
    harry = harry_covert.copy()
    harry.structure_name = "Not an existing Structure"
    await import_beneficiaries(test_client, get_manager_jwt, [harry])

    beneficiary_in_db = await get_beneficiary_from_personal_information(
        db_connection, "Harry", "Covert", date(1985, 7, 23)
    )
    associated_structures = await get_structures_for_beneficiary(
        db_connection, beneficiary_in_db.id
    )

    assert not associated_structures
    assert not beneficiary_in_db.notebook.members


async def test_existing_structure_non_existing_referent(
    test_client,
    get_manager_jwt,
    db_connection,
):
    harry = harry_covert.copy()
    harry.advisor_email = "jean.biche@nullepart.fr"
    await import_beneficiaries(test_client, get_manager_jwt, [harry])

    beneficiary_in_db = await get_beneficiary_from_personal_information(
        db_connection, "Harry", "Covert", date(1985, 7, 23)
    )
    associated_structures = await get_structures_for_beneficiary(
        db_connection, beneficiary_in_db.id
    )

    assert associated_structures[0].structure_name == harry.structure_name
    assert associated_structures[0].beneficiary_status == "pending"
    assert not beneficiary_in_db.notebook.members


async def test_no_structure_non_existing_referent(
    test_client,
    get_manager_jwt,
    db_connection,
):
    harry = harry_covert.copy()
    harry.structure_name = None
    harry.advisor_email = "jean.biche@nullepart.fr"
    await import_beneficiaries(test_client, get_manager_jwt, [harry])

    beneficiary_in_db = await get_beneficiary_from_personal_information(
        db_connection, "Harry", "Covert", date(1985, 7, 23)
    )
    associated_structures = await get_structures_for_beneficiary(
        db_connection, beneficiary_in_db.id
    )

    assert not associated_structures
    assert not beneficiary_in_db.notebook.members


class ListOf(BaseModel):
    __root__: List[BeneficiaryImport]


sophie_tifour_bad_caps = BeneficiaryImport(
    internal_id="1234",
    firstname="SoPhiE",
    lastname="TIFOUR",
    date_of_birth=date(1982, 2, 1),
)


harry_covert = BeneficiaryImport(
    internal_id="123",
    firstname="Harry",
    lastname="Covert",
    date_of_birth=date(1985, 7, 23),
    place_of_birth="Paris",
    mobile_number="0657912322",
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
    education_level="NV1",
    structure_name="Pole Emploi Agence Livry-Gargnan",
    advisor_email="dunord@pole-emploi.fr",
    nir="185077505612323",
)

harry_covert_reimport = BeneficiaryImport(
    internal_id="123",
    firstname="Harry",
    lastname="Covert",
    date_of_birth=date(1985, 7, 23),
    place_of_birth="Lyon",
    mobile_number="0600000000",
    email="harry.covert@lycos.fr",
    address1="1 Grande rue",
    address2=None,
    postal_code="26270",
    city="Loriol",
    work_situation=None,
    caf_number=None,
    pe_number=None,
    right_rsa=None,
    right_are=None,
    right_ass=None,
    right_bonus=None,
    right_rqth=None,
    geographical_area=None,
    rome_code_description=None,
    education_level=None,
    structure_name=None,
    advisor_email=None,
    nir="100000000000047",
)

harry_covert_phoneless = BeneficiaryImport(
    internal_id="123",
    firstname="Harry",
    lastname="Covert",
    date_of_birth=date(1985, 7, 23),
)

harry_covert_typo = BeneficiaryImport(
    internal_id="123",
    firstname="Harry,",
    lastname="Covert",
    date_of_birth=date(1985, 7, 23),
    mobile_number="0657912322",
)

harry_covert_with_caps_and_space = BeneficiaryImport(
    internal_id="123",
    firstname="Harry ",
    lastname="  CoVert",
    date_of_birth=date(1985, 7, 23),
    mobile_number="0657912322",
)


betty_bois = BeneficiaryImport(
    internal_id="1234",
    firstname="Betty",
    lastname="Bois",
    date_of_birth=date(1970, 9, 15),
)
