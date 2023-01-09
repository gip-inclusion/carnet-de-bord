from backend.api.core.emails import generic_account_creation_email


def test_generic_account_creation_email():
    data = {
        "username": "lionelbe",
        "firstname": "lionel",
        "lastname": "Bé",
        "access_key": "1234-1234-1234-1234",
    }

    mail = generic_account_creation_email(**data)

    assert data["firstname"] in mail
    assert data["lastname"] in mail
    assert data["username"] in mail
    assert data["access_key"] in mail
