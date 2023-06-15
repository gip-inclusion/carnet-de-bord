import json
import logging
from datetime import date
from typing import List
from unittest import mock

import pytest
from asyncpg import Record
from asyncpg.connection import Connection
from httpx import AsyncClient
from pydantic import BaseModel

from cdb.api.db.crud.beneficiary import (
    get_beneficiary_from_personal_information,
    get_structures_for_beneficiary,
)
from cdb.api.db.crud.professional import get_professional_by_email
from cdb.api.db.crud.rome_code import get_rome_code_by_id
from cdb.api.db.models.beneficiary import Beneficiary, BeneficiaryImport


async def import_beneficiaries(
    client, token: str, beneficiaries: list[BeneficiaryImport]
):
    return await client.post(
        "/v1/beneficiaries/bulk",
        headers={"Authorization": "Bearer " + token},
        content=json.dumps(
            {
                "need_orientation": True,
                "beneficiaries": [benef.dict() for benef in beneficiaries],
            },
            default=str,
        ),
    )


@pytest.mark.graphql
@mock.patch("cdb.api.core.emails.send_mail")
async def test_upload_caf_msa(
    sendmail_mock: mock.Mock,
    db_connection: Connection,
    test_client: AsyncClient,
    fichier_mensuel_caf: str,
    get_manager_jwt_93: str,
    sophie_tifour_beneficiary_id: str,
):
    with open(fichier_mensuel_caf, "rb") as file:
        response = await test_client.post(
            "/v1/beneficiaries/update-from-caf-msa",
            files={"upload_file": ("filename", file, "text/csv")},
            headers={"Authorization": "Bearer " + get_manager_jwt_93},
        )
        assert response.status_code == 201
        assert sendmail_mock.call_count == 1
        beneficiary = await db_connection.fetchrow(
            """
    select * from beneficiary where id = $1
    """,
            sophie_tifour_beneficiary_id,
        )
    assert beneficiary
    assert beneficiary["right_rsa"] == "rsa_clos"
    assert sendmail_mock.call_count == 1


@pytest.mark.graphql
@mock.patch("cdb.api.core.emails.send_mail")
async def test_upload_caf_msa_reouvert(
    sendmail_mock: mock.MagicMock,
    test_client: AsyncClient,
    fichier_mensuel_caf_reouvert: str,
    get_manager_jwt_93: str,
    db_connection: Connection,
    eta_bullock_beneficiary_id: str,
):
    await db_connection.fetchrow(
        """
    update beneficiary
    set
        rsa_suspension_reason='caf_moins_25_sans_personne_charge',
        right_rsa='rsa_droit_ouvert_et_suspendu'
    where id=$1
    """,
        eta_bullock_beneficiary_id,
    )

    with open(fichier_mensuel_caf_reouvert, "rb") as file:
        response = await test_client.post(
            "/v1/beneficiaries/update-from-caf-msa",
            files={"upload_file": ("filename", file, "text/csv")},
            headers={"Authorization": "Bearer " + get_manager_jwt_93},
        )
        assert response.status_code == 201

    beneficiary: Record = await db_connection.fetchrow(
        """
    select * from beneficiary where id = $1
    """,
        eta_bullock_beneficiary_id,
    )
    assert beneficiary
    assert beneficiary["rsa_suspension_reason"] is None
    assert sendmail_mock.call_count == 1


async def test_import_beneficiaries_must_be_done_by_a_manager(
    test_client: AsyncClient,
    get_professional_jwt: str,
):
    response = await test_client.post(
        "/v1/beneficiaries/bulk",
        headers={"Authorization": "Bearer " + get_professional_jwt},
        content=json.dumps(
            {
                "beneficiaries": [],
                "need_orientation": True,
            },
            default=str,
        ),
    )
    assert response.status_code == 403


async def test_import_beneficiaries(
    test_client: AsyncClient,
    get_manager_jwt_93: str,
):
    response = await import_beneficiaries(test_client, get_manager_jwt_93, [])
    assert response.status_code == 200


async def test_import_a_new_beneficiary(
    test_client: AsyncClient,
    get_manager_jwt_93: str,
    db_connection: Connection,
):
    response = await import_beneficiaries(
        test_client, get_manager_jwt_93, [harry_covert]
    )
    beneficiary_in_db = await get_beneficiary_from_personal_information(
        db_connection, "Harry", "Covert", date(1985, 7, 23)
    )
    assert response.status_code == 200
    assert beneficiary_in_db


async def test_update_existing_beneficiary_same_name(
    test_client: AsyncClient, get_manager_jwt_93: str, db_connection: Connection
):
    await import_beneficiaries(
        test_client, get_manager_jwt_93, [harry_covert_phoneless]
    )

    beneficiary_in_db: Beneficiary = await get_beneficiary_from_personal_information(
        db_connection, "Harry", "Covert", date(1985, 7, 23)
    )
    assert beneficiary_in_db.mobile_number is None

    await import_beneficiaries(test_client, get_manager_jwt_93, [harry_covert])

    beneficiary_in_db: Beneficiary = await get_beneficiary_from_personal_information(
        db_connection, "Harry", "Covert", date(1985, 7, 23)
    )
    assert beneficiary_in_db.mobile_number == harry_covert.mobile_number


async def test_insert_beneficiary_with_existing_si_id_in_other_deployment(
    test_client: AsyncClient, get_manager_jwt_93: str, get_manager_jwt_51: str
):
    await import_beneficiaries(
        test_client, get_manager_jwt_51, [harry_covert_phoneless]
    )
    response = await import_beneficiaries(
        test_client, get_manager_jwt_93, [harry_covert_phoneless]
    )
    assert response.status_code == 200


async def test_do_not_update_beneficiary_with_same_si_id_but_different_name(
    test_client: AsyncClient,
    get_manager_jwt_93: str,
    db_connection: str,
):
    await import_beneficiaries(
        test_client, get_manager_jwt_93, [harry_covert_phoneless]
    )

    beneficiary_in_db = await get_beneficiary_from_personal_information(
        db_connection, "Harry", "Covert", date(1985, 7, 23)
    )
    assert beneficiary_in_db.mobile_number is None

    response = await import_beneficiaries(
        test_client, get_manager_jwt_93, [harry_covert_typo]
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
    test_client: AsyncClient, get_manager_jwt_93: str, db_connection: Connection, caplog
):
    with caplog.at_level(logging.INFO):
        await import_beneficiaries(
            test_client, get_manager_jwt_93, [sophie_tifour_bad_caps]
        )

        beneficiary_in_db: Beneficiary | None = (
            await get_beneficiary_from_personal_information(
                db_connection, "Sophie", "Tifour", date(1982, 2, 1)
            )
        )

        assert "updated existing beneficiary" in caplog.text
        assert beneficiary_in_db is not None
        assert beneficiary_in_db.external_id == sophie_tifour_bad_caps.external_id


async def test_insert_beneficiary_check_all_fields(
    test_client: AsyncClient,
    get_manager_jwt_93: str,
    db_connection: Connection,
):
    await import_beneficiaries(test_client, get_manager_jwt_93, [harry_covert])

    beneficiary_in_db: Beneficiary = await get_beneficiary_from_personal_information(
        db_connection, "Harry", "Covert", date(1985, 7, 23)
    )
    assert beneficiary_in_db.firstname == harry_covert.firstname
    assert beneficiary_in_db.lastname == harry_covert.lastname
    assert beneficiary_in_db.date_of_birth == harry_covert.date_of_birth
    assert beneficiary_in_db.external_id == harry_covert.external_id
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
    assert beneficiary_in_db.nir == harry_covert.nir[:13]

    assert beneficiary_in_db.notebook.right_rqth is False
    assert beneficiary_in_db.right_rsa == harry_covert.right_rsa
    assert beneficiary_in_db.right_are is True
    assert beneficiary_in_db.right_ass is False
    assert beneficiary_in_db.right_bonus is False
    assert beneficiary_in_db.notebook.education_level == harry_covert.education_level

    professional_projects = [
        await get_rome_code_by_id(db_connection, wj.rome_code_id)
        for wj in beneficiary_in_db.notebook.professional_projects
    ]
    assert harry_covert.rome_code_description in [
        rome_code.label for rome_code in professional_projects
    ]
    referent = await get_professional_by_email(
        db_connection, harry_covert.advisor_email
    )
    assert referent.account_id == beneficiary_in_db.notebook.members[0].account_id


async def test_update_beneficiary_check_all_fields(
    test_client: AsyncClient,
    get_manager_jwt_93: str,
    db_connection: Connection,
):
    await import_beneficiaries(
        test_client, get_manager_jwt_93, [harry_covert_phoneless]
    )
    await import_beneficiaries(test_client, get_manager_jwt_93, [harry_covert])

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
    assert beneficiary_in_db.nir == harry_covert.nir[:13]
    assert beneficiary_in_db.notebook.work_situation == harry_covert.work_situation
    assert beneficiary_in_db.notebook.right_rqth is False
    assert beneficiary_in_db.right_rsa == harry_covert.right_rsa
    assert beneficiary_in_db.right_are is True
    assert beneficiary_in_db.right_ass is False
    assert beneficiary_in_db.right_bonus is False
    assert beneficiary_in_db.notebook.education_level == harry_covert.education_level
    professional_projects = [
        await get_rome_code_by_id(db_connection, wj.rome_code_id)
        for wj in beneficiary_in_db.notebook.professional_projects
    ]
    assert harry_covert.rome_code_description in [
        rome_code.label for rome_code in professional_projects
    ]


async def test_dont_update_beneficiary_with_empty_fields(
    test_client: AsyncClient,
    get_manager_jwt_93: str,
    db_connection: Connection,
):
    await import_beneficiaries(test_client, get_manager_jwt_93, [harry_covert])
    beneficiary_in_db = await get_beneficiary_from_personal_information(
        db_connection, "Harry", "Covert", date(1985, 7, 23)
    )
    await import_beneficiaries(
        test_client, get_manager_jwt_93, [harry_covert_phoneless]
    )
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
    assert beneficiary_in_db.nir == harry_covert.nir[:13]
    assert beneficiary_in_db.notebook.right_rqth is False
    assert beneficiary_in_db.right_rsa == harry_covert.right_rsa
    assert beneficiary_in_db.right_are is True
    assert beneficiary_in_db.right_ass is False
    assert beneficiary_in_db.right_bonus is False
    assert beneficiary_in_db.notebook.education_level == harry_covert.education_level


async def test_only_update_beneficiary_with_not_null_fields(
    test_client: AsyncClient,
    get_manager_jwt_93: str,
    db_connection: Connection,
):
    await import_beneficiaries(test_client, get_manager_jwt_93, [harry_covert])
    beneficiary_in_db = await get_beneficiary_from_personal_information(
        db_connection, "Harry", "Covert", date(1985, 7, 23)
    )
    await import_beneficiaries(test_client, get_manager_jwt_93, [harry_covert_reimport])
    beneficiary_in_db = await get_beneficiary_from_personal_information(
        db_connection, "Harry", "Covert", date(1985, 7, 23)
    )
    assert beneficiary_in_db.mobile_number == harry_covert_reimport.mobile_number
    assert beneficiary_in_db.email == harry_covert_reimport.email
    assert beneficiary_in_db.address1 == harry_covert_reimport.address1
    assert beneficiary_in_db.address2 == harry_covert_reimport.address2
    assert beneficiary_in_db.postal_code == harry_covert_reimport.postal_code
    assert beneficiary_in_db.city == harry_covert_reimport.city
    assert beneficiary_in_db.nir == harry_covert_reimport.nir[:13]
    assert beneficiary_in_db.caf_number == harry_covert.caf_number
    assert beneficiary_in_db.pe_number == harry_covert.pe_number
    assert beneficiary_in_db.notebook.work_situation == harry_covert.work_situation
    assert beneficiary_in_db.notebook.right_rqth is False
    assert beneficiary_in_db.right_rsa == harry_covert.right_rsa
    assert beneficiary_in_db.right_are is True
    assert beneficiary_in_db.right_ass is False
    assert beneficiary_in_db.right_bonus is False
    assert beneficiary_in_db.notebook.education_level == harry_covert.education_level


async def test_import_multiple_beneficiaries(
    test_client: AsyncClient,
    get_manager_jwt_93: str,
    db_connection: Connection,
):
    response = await import_beneficiaries(
        test_client, get_manager_jwt_93, [harry_covert, betty_bois]
    )
    harry_in_db = await get_beneficiary_from_personal_information(
        db_connection, "Harry", "Covert", date(1985, 7, 23)
    )
    betty_in_db = await get_beneficiary_from_personal_information(
        db_connection, "Harry", "Covert", date(1985, 7, 23)
    )
    assert response.status_code == 200
    assert harry_in_db
    assert betty_in_db


async def test_import_multiple_professional_projects(
    test_client: AsyncClient,
    get_manager_jwt_93: str,
    db_connection: Connection,
):
    harry_covert_wants_more = harry_covert.copy()
    harry_covert_wants_more.rome_code_description = (
        harry_covert.rome_code_description
        + ", Chauffeur / Chauffeuse de machines agricoles (A1101)"
    )
    await import_beneficiaries(
        test_client, get_manager_jwt_93, [harry_covert_wants_more]
    )

    beneficiary_in_db = await get_beneficiary_from_personal_information(
        db_connection, "Harry", "Covert", date(1985, 7, 23)
    )

    professional_projects = [
        await get_rome_code_by_id(db_connection, wj.rome_code_id)
        for wj in beneficiary_in_db.notebook.professional_projects
    ]
    professional_project_labels = [
        rome_code.label for rome_code in professional_projects
    ]
    assert (
        "Chauffeur / Chauffeuse de machines agricoles (A1101)"
        in professional_project_labels
    )
    assert (
        "Pontier élingueur / Pontière élingueuse (N1104)" in professional_project_labels
    )


async def test_matched_existing_referent_and_structure(
    test_client: AsyncClient,
    get_manager_jwt_93: str,
    db_connection: Connection,
):
    await import_beneficiaries(test_client, get_manager_jwt_93, [harry_covert])

    beneficiary_in_db = await get_beneficiary_from_personal_information(
        db_connection, "Harry", "Covert", date(1985, 7, 23)
    )
    associated_structures = await get_structures_for_beneficiary(
        db_connection, beneficiary_in_db.id
    )

    assert associated_structures[0].structure_name == harry_covert.structure_name
    assert associated_structures[0].beneficiary_status == "current"

    referent = await get_professional_by_email(
        db_connection, harry_covert.advisor_email
    )

    assert referent.account_id in [
        member.account_id
        for member in beneficiary_in_db.notebook.members
        if member.member_type == "referent"
    ]


async def test_existing_structure_no_referent(
    test_client: AsyncClient,
    get_manager_jwt_93: str,
    db_connection: Connection,
):
    harry = harry_covert.copy()
    harry.advisor_email = None
    await import_beneficiaries(test_client, get_manager_jwt_93, [harry])

    beneficiary_in_db = await get_beneficiary_from_personal_information(
        db_connection, "Harry", "Covert", date(1985, 7, 23)
    )
    associated_structures = await get_structures_for_beneficiary(
        db_connection, beneficiary_in_db.id
    )

    assert associated_structures[0].structure_name == harry.structure_name
    assert associated_structures[0].beneficiary_status == "current"

    assert not beneficiary_in_db.notebook.members


async def test_existing_referent_no_structure(
    test_client: AsyncClient,
    get_manager_jwt_93: str,
    db_connection: Connection,
):
    harry = harry_covert.copy()
    harry.structure_name = None
    await import_beneficiaries(test_client, get_manager_jwt_93, [harry])

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
    assert associated_structures[0].beneficiary_status == "current"

    assert referent.account_id in [
        member.account_id
        for member in beneficiary_in_db.notebook.members
        if member.member_type == "referent"
    ]


async def test_existing_referent_not_in_existing_structure(
    test_client: AsyncClient,
    get_manager_jwt_93: str,
    db_connection: Connection,
):
    harry = harry_covert.copy()
    harry.structure_name = "Service Social Départemental"
    await import_beneficiaries(test_client, get_manager_jwt_93, [harry])

    beneficiary_in_db = await get_beneficiary_from_personal_information(
        db_connection, "Harry", "Covert", date(1985, 7, 23)
    )
    associated_structures = await get_structures_for_beneficiary(
        db_connection, beneficiary_in_db.id
    )

    assert associated_structures[0].structure_name == harry.structure_name
    assert associated_structures[0].beneficiary_status == "current"
    assert not beneficiary_in_db.notebook.members


async def test_non_existing_structure(
    test_client: AsyncClient,
    get_manager_jwt_93: str,
    db_connection: Connection,
):
    harry = harry_covert.copy()
    harry.structure_name = "Not an existing Structure"
    await import_beneficiaries(test_client, get_manager_jwt_93, [harry])

    beneficiary_in_db = await get_beneficiary_from_personal_information(
        db_connection, "Harry", "Covert", date(1985, 7, 23)
    )
    associated_structures = await get_structures_for_beneficiary(
        db_connection, beneficiary_in_db.id
    )

    assert not associated_structures
    assert not beneficiary_in_db.notebook.members


async def test_existing_structure_non_existing_referent(
    test_client: AsyncClient,
    get_manager_jwt_93: str,
    db_connection: Connection,
):
    harry = harry_covert.copy()
    harry.advisor_email = "jean.biche@nullepart.fr"
    await import_beneficiaries(test_client, get_manager_jwt_93, [harry])

    beneficiary_in_db = await get_beneficiary_from_personal_information(
        db_connection, "Harry", "Covert", date(1985, 7, 23)
    )
    associated_structures = await get_structures_for_beneficiary(
        db_connection, beneficiary_in_db.id
    )

    assert associated_structures[0].structure_name == harry.structure_name
    assert associated_structures[0].beneficiary_status == "current"
    assert not beneficiary_in_db.notebook.members


async def test_no_structure_non_existing_referent(
    test_client: AsyncClient,
    get_manager_jwt_93: str,
    db_connection: Connection,
):
    harry = harry_covert.copy()
    harry.structure_name = None
    harry.advisor_email = "jean.biche@nullepart.fr"
    await import_beneficiaries(test_client, get_manager_jwt_93, [harry])

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
    external_id="1234",
    firstname="SoPhiE",
    lastname="TIFOUR",
    date_of_birth=date(1982, 2, 1),
)


harry_covert = BeneficiaryImport(
    external_id="123",
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
    rome_code_description="Pontier élingueur / Pontière élingueuse (N1104)",
    education_level="NV1",
    structure_name="Pole Emploi Agence Livry-Gargnan",
    advisor_email="dunord@pole-emploi.fr",
    nir="185077505612323",
)

harry_covert_reimport = BeneficiaryImport(
    external_id="123",
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
    rome_code_description=None,
    education_level=None,
    structure_name=None,
    advisor_email=None,
    nir="100000000000047",
)

harry_covert_phoneless = BeneficiaryImport(
    external_id="123",
    firstname="Harry",
    lastname="Covert",
    date_of_birth=date(1985, 7, 23),
)

harry_covert_typo = BeneficiaryImport(
    external_id="123",
    firstname="Harry,",
    lastname="Covert",
    date_of_birth=date(1985, 7, 23),
    mobile_number="0657912322",
)

harry_covert_with_caps_and_space = BeneficiaryImport(
    external_id="123",
    firstname="Harry ",
    lastname="  CoVert",
    date_of_birth=date(1985, 7, 23),
    mobile_number="0657912322",
)


betty_bois = BeneficiaryImport(
    external_id="1234",
    firstname="Betty",
    lastname="Bois",
    date_of_birth=date(1970, 9, 15),
)
