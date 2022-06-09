from api.core.emails import orientation_manager_account_creation_email


def test_orientation_manager_account_creation_email():
    data = {
        "username": "lionelbe",
        "firstname": "lionel",
        "lastname": "Bé",
        "access_key": "1234-1234-1234-1234",
    }

    mail = orientation_manager_account_creation_email(**data)

    assert data["firstname"] in mail
    assert data["lastname"] in mail
    assert data["username"] in mail
    assert data["access_key"] in mail
