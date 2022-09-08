from unittest.mock import MagicMock

from asyncpg.connection import Connection

sendmail_path = "api.v1.routers.admin_structures.send_mail"
api_path = "/v1/admin_structures/create"
sender_email = "test@toto.fr"


async def test_jwt_token_verification(
    test_client,
    get_professionnal_jwt,
    mocker,
):
    mocker.patch(sendmail_path, return_value=True)

    response = test_client.post(
        api_path,
        json={
            "admin": {
                "email": sender_email,
                "firstname": "lionel",
                "lastname": "Bé",
                "phone_numbers": "0601020304",
                "position": "responsable",
                "deployment_id": deployment_id,
            },
            "structure_id": structure_id,
        },
        headers={"jwt-token": f"{get_professionnal_jwt}"},
    )

    json = response.json()

    assert response.status_code == 400
    assert json["detail"] == "Role not allowed"


deployment_id = "4dab8036-a86e-4d5f-9bd4-6ce88c1940d0"
structure_id = "a81bc81b-dead-4e5d-abff-90865d1e13b2"  # pole emploi livry-gargan


async def test_insert_admin_structure_with_structure_in_db(
    test_client,
    db_connection: Connection,
    get_admin_structure_jwt,
    mocker,
):
    mocker.patch(sendmail_path, return_value=True)

    response = test_client.post(
        api_path,
        json={
            "admin": {
                "email": sender_email,
                "firstname": "lionel",
                "lastname": "Bé",
                "phone_numbers": "0601020304",
                "position": "responsable",
                "deployment_id": deployment_id,
            },
            "structure_id": structure_id,
        },
        headers={"jwt-token": f"{get_admin_structure_jwt}"},
    )

    assert response.status_code == 200

    record = await db_connection.fetchrow(
        """
            SELECT firstname, lastname, admin_structure.email as adm_email, confirmed, name
            FROM public.admin_structure, admin_structure_structure, structure, account
            WHERE admin_structure.id = admin_structure_structure.admin_structure_id
            AND admin_structure_structure.structure_id = structure.id
            AND account.admin_structure_id = admin_structure.id
            AND admin_structure.email LIKE $1
         """,
        sender_email,
    )

    assert record
    assert record["confirmed"]
    assert record["adm_email"] == sender_email
    assert record["firstname"] == "lionel"
    assert record["lastname"] == "Bé"
    assert record["name"] == "Pole Emploi Agence Livry-Gargnan"


async def test_insert_existing_admin_structure_in_structure_in_db(
    test_client,
    db_connection: Connection,
    get_admin_structure_jwt,
    mocker,
):
    mocker.patch(sendmail_path, return_value=True)

    response = test_client.post(
        api_path,
        json={
            "admin": {
                "email": "vincent.timaitre@groupe-ns.fr ",
                "firstname": "Vincent",
                "lastname": "timaitre",
                "phone_numbers": "0601020304",
                "position": "responsable",
                "deployment_id": deployment_id,
            },
            "structure_id": structure_id,
        },
        headers={"jwt-token": f"{get_admin_structure_jwt}"},
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


async def test_insert_existing_admin_structure_in_existing_structure(
    test_client,
    get_admin_structure_jwt,
    mocker,
):
    mocker.patch(sendmail_path, return_value=True)

    response = test_client.post(
        api_path,
        json={
            "admin": {
                "email": "vincent.timaitre@groupe-ns.fr ",
                "firstname": "Vincent",
                "lastname": "timaitre",
                "phone_numbers": "0601020304",
                "position": "responsable",
                "deployment_id": deployment_id,
            },
            "structure_id": "8b71184c-6479-4440-aa89-15da704cc792",
        },
        headers={"jwt-token": f"{get_admin_structure_jwt}"},
    )

    assert response.status_code == 422


async def test_background_task(test_client, get_admin_structure_jwt: str, mocker):
    mock: MagicMock = mocker.patch(sendmail_path, return_value=True)
    test_client.post(
        api_path,
        json={
            "admin": {
                "email": sender_email,
                "firstname": "lionel",
                "lastname": "Bé",
                "phone_numbers": "0601020304",
                "position": "responsable",
                "deployment_id": deployment_id,
            },
            "structure_id": structure_id,
        },
        headers={"jwt-token": f"{get_admin_structure_jwt}"},
    )
    assert len(mock.mock_calls) == 1
    assert mock.mock_calls[0].args[0] == sender_email
    assert mock.mock_calls[0].args[1] == "Création de compte sur Carnet de bord"
