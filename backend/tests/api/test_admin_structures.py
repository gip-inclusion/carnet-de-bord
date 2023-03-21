from unittest import mock
from uuid import UUID

from asyncpg.connection import Connection

ENDPOINT_PATH = "/v1/admin_structures/create"
sender_email = "test@toto.fr"


@mock.patch("cdb.api.v1.routers.admin_structures.send_invitation_email")
async def test_jwt_token_verification(
    _: mock.Mock,
    test_client,
    get_professional_jwt,
    deployment_id_cd93: UUID,
    structure_id_pe_livry: UUID,
):

    response = test_client.post(
        ENDPOINT_PATH,
        json={
            "admin": {
                "email": sender_email,
                "firstname": "lionel",
                "lastname": "Bé",
                "phone_numbers": "0601020304",
                "position": "responsable",
                "deployment_id": deployment_id_cd93,
            },
            "structure_id": structure_id_pe_livry,
        },
        headers={"jwt-token": get_professional_jwt},
    )

    json = response.json()

    assert response.status_code == 403
    assert json["detail"] == "Operation forbidden to the given role"


@mock.patch("cdb.api.v1.routers.admin_structures.send_invitation_email")
async def test_insert_admin_structure_with_structure_in_db(
    mock_send_invitation_mail: mock.Mock,
    test_client,
    db_connection: Connection,
    get_admin_structure_jwt,
    deployment_id_cd93: UUID,
    structure_id_pe_livry: UUID,
):

    response = test_client.post(
        ENDPOINT_PATH,
        json={
            "admin": {
                "email": sender_email,
                "firstname": "lionel",
                "lastname": "Bé",
                "phone_numbers": "0601020304",
                "position": "responsable",
                "deployment_id": deployment_id_cd93,
            },
            "structure_id": structure_id_pe_livry,
        },
        headers={"jwt-token": get_admin_structure_jwt},
    )

    assert response.status_code == 200

    record = await db_connection.fetchrow(
        """
        SELECT firstname, lastname, admin_structure.email as adm_email, confirmed, access_key, name
        FROM public.admin_structure, admin_structure_structure, structure, account
        WHERE admin_structure.id = admin_structure_structure.admin_structure_id
            AND admin_structure_structure.structure_id = structure.id
            AND account.admin_structure_id = admin_structure.id
            AND admin_structure.email LIKE $1
        """,  # noqa: E501
        sender_email,
    )

    assert record
    assert record["confirmed"]
    assert record["adm_email"] == sender_email
    assert record["firstname"] == "lionel"
    assert record["lastname"] == "Bé"
    assert record["name"] == "Pole Emploi Agence Livry-Gargnan"

    mock_send_invitation_mail.assert_called_once()
    mock_send_invitation_mail.assert_called_once_with(
        email=sender_email,
        firstname="lionel",
        lastname="Bé",
        access_key=UUID(record["access_key"]),
    )


@mock.patch("cdb.api.v1.routers.admin_structures.send_invitation_email")
async def test_insert_existing_admin_structure_in_structure_in_db(
    _: mock.Mock,
    test_client,
    db_connection: Connection,
    get_admin_structure_jwt,
    deployment_id_cd93: UUID,
    structure_id_pe_livry: UUID,
):
    response = test_client.post(
        ENDPOINT_PATH,
        json={
            "admin": {
                "email": "vincent.timaitre@groupe-ns.fr ",
                "firstname": "Vincent",
                "lastname": "timaitre",
                "phone_numbers": "0601020304",
                "position": "responsable",
                "deployment_id": deployment_id_cd93,
            },
            "structure_id": structure_id_pe_livry,
        },
        headers={"jwt-token": get_admin_structure_jwt},
    )

    assert response.status_code == 200

    records = await db_connection.fetch(
        """
            SELECT structure.name as s_name, admin_structure.email as email
            FROM public.admin_structure, admin_structure_structure, structure, account
            WHERE admin_structure.id = admin_structure_structure.admin_structure_id
            AND admin_structure_structure.structure_id = structure.id
            AND account.admin_structure_id = admin_structure.id
            AND admin_structure.email LIKE $1
            ORDER BY s_name
         """,
        "vincent.timaitre@groupe-ns.fr",
    )

    assert len(records) == 2
    assert records[0]["s_name"] == "Groupe NS"
    assert records[0]["email"] == "vincent.timaitre@groupe-ns.fr"
    assert records[1]["s_name"] == "Pole Emploi Agence Livry-Gargnan"
    assert records[1]["email"] == "vincent.timaitre@groupe-ns.fr"


@mock.patch("cdb.api.v1.routers.admin_structures.send_invitation_email")
async def test_insert_existing_admin_structure_in_existing_structure(
    _: mock.Mock,
    test_client,
    get_admin_structure_jwt,
    deployment_id_cd93: UUID,
    structure_id_pe_livry: UUID,
):

    response = test_client.post(
        ENDPOINT_PATH,
        json={
            "admin": {
                "email": "vincent.timaitre@groupe-ns.fr ",
                "firstname": "Vincent",
                "lastname": "timaitre",
                "phone_numbers": "0601020304",
                "position": "responsable",
                "deployment_id": deployment_id_cd93,
            },
            "structure_id": structure_id_pe_livry,
        },
        headers={"jwt-token": get_admin_structure_jwt},
    )

    assert response.status_code == 200


@mock.patch("cdb.api.v1.routers.admin_structures.send_invitation_email")
async def test_insert_deleted_admin_structure_in_structure_in_db(
    _: mock.Mock,
    test_client,
    db_connection: Connection,
    get_admin_structure_jwt,
    deployment_id_cd93: UUID,
    structure_id_pe_livry: UUID,
):

    records = await db_connection.fetch(
        """
            UPDATE admin_structure_structure SET deleted_at = 'now()'
            FROM admin_structure
            WHERE admin_structure_structure.admin_structure_id = admin_structure.id
                AND admin_structure_structure.structure_id = $1
                AND admin_structure.email = $2
            RETURNING
                admin_structure_structure.id,
                admin_structure_structure.structure_id,
                admin_structure_structure.admin_structure_id
        """,
        structure_id_pe_livry,
        "vincent.timaitre@groupe-ns.fr",
    )

    response = test_client.post(
        ENDPOINT_PATH,
        json={
            "admin": {
                "email": "vincent.timaitre@groupe-ns.fr ",
                "firstname": "Vincent",
                "lastname": "timaitre",
                "phone_numbers": "0601020304",
                "position": "responsable",
                "deployment_id": deployment_id_cd93,
            },
            "structure_id": structure_id_pe_livry,
        },
        headers={"jwt-token": get_admin_structure_jwt},
    )

    assert response.status_code == 200

    records = await db_connection.fetch(
        """
            SELECT structure.name as s_name, admin_structure.email as email
            FROM public.admin_structure, admin_structure_structure, structure, account
            WHERE admin_structure.id = admin_structure_structure.admin_structure_id
            AND admin_structure_structure.structure_id = structure.id
            AND account.admin_structure_id = admin_structure.id
            AND admin_structure.email LIKE $1
            AND admin_structure_structure.deleted_at IS NULL
            ORDER BY s_name
         """,
        "vincent.timaitre@groupe-ns.fr",
    )

    assert len(records) == 2
    assert records[0]["s_name"] == "Groupe NS"
    assert records[0]["email"] == "vincent.timaitre@groupe-ns.fr"
    assert records[1]["s_name"] == "Pole Emploi Agence Livry-Gargnan"
    assert records[1]["email"] == "vincent.timaitre@groupe-ns.fr"
