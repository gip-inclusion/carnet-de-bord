import re

import phonenumbers
from pydantic import validator


def phone(value: str) -> str:
    if not value:
        return value

    for phone in value.split(","):
        parsed_number = phonenumbers.parse(phone, "FR")

        if not phonenumbers.is_possible_number(parsed_number):
            raise ValueError("value is not a valid phone number")

    return ", ".join(
        [
            phonenumbers.format_number(
                phonenumbers.parse(phone, "FR"),
                phonenumbers.PhoneNumberFormat.E164,
            )
            for phone in value.split(",")
        ]
    )


def phone_validator(*args, **kwargs):
    decorator = validator(*args, **kwargs, allow_reuse=True)
    decorated = decorator(phone)
    return decorated


def postal_code(value: str) -> str:
    if not value:
        return value
    if (
        value[0:2] == "00"
    ):  ## Les 2 premiers digits correspondent au numéro de departement, 00 n'est donc pas valide
        raise ValueError("value is not a valid postal code")
    if not re.match("^[0-9]{5}$", value):
        raise ValueError("value is not a valid postal code")
    return value


def postal_code_validator(*args, **kwargs):
    decorator = validator(*args, **kwargs, allow_reuse=True)
    decorated = decorator(postal_code)
    return decorated


def is_bool(value):
    if type(value) == str:
        if value.lower() in ["oui", "o"]:
            return True
        else:
            return False
    elif type(value) == bool:
        return value
    else:
        return False


def is_bool_validator(*args, **kwargs):
    decorator = validator(*args, **kwargs, allow_reuse=True)
    decorated = decorator(is_bool)
    return decorated
