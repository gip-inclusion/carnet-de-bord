import datetime
import re

import phonenumbers
from pydantic import validator

DATE_YMD_HYPHEN_FORMAT = "%Y-%m-%d"
DATE_DMY_SLASH_FORMAT = "%d/%m/%Y"
DATE_DMY_HYPHEN_FORMAT = "%d-%m-%Y"

DATE_FORMATS = [DATE_YMD_HYPHEN_FORMAT, DATE_DMY_SLASH_FORMAT, DATE_DMY_HYPHEN_FORMAT]


def date(value: str) -> str:
    if not value or type(value) is not str:
        return value

    for date_format in DATE_FORMATS:
        try:
            parsed_date = datetime.datetime.strptime(value, date_format)
            return parsed_date.strftime(DATE_YMD_HYPHEN_FORMAT)
        except ValueError:
            pass

    raise ValueError("Value is not a known date format. Valid format: YYYY-MM-DD.")


def date_validator(*args, **kwargs):
    decorator = validator(*args, **kwargs, allow_reuse=True)
    decorated = decorator(date)
    return decorated


def phone(value: str) -> str:
    if not value:
        return value

    for phone_value in value.split(","):
        try:
            parsed_number = phonenumbers.parse(phone_value, "FR")
        except Exception as error:
            raise ValueError("value is not a valid phone number") from error
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
        print(value, value.lower() in ["oui", "o"])
        if value.lower() in ["oui", "o"]:
            return True
        else:
            return False
    elif type(value) == bool:
        return value
    else:
        return None


def is_bool_validator(*args, **kwargs):
    decorator = validator(*args, **kwargs, allow_reuse=True)
    decorated = decorator(is_bool)
    return decorated
