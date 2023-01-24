import logging
from itertools import groupby

import sentry_sdk
from asyncpg.connection import Connection

from cdb.api.core.emails import (
    send_beneficiaries_without_referent_to_admin_structure_email,
)
from cdb.api.core.settings import settings
from cdb.api.db.crud.beneficiary import get_beneficiaries_without_referent
from cdb.api.db.models.beneficiary import BeneficiaryWithAdminStructureEmail
from cdb.api.db.models.email import PersonWithDateOfBirth, StructureWithBeneficiaries

sentry_sdk.init(attach_stacktrace=True)

logging.basicConfig(level=logging.INFO, format=settings.LOG_FORMAT)


async def notify_admin_structures(db_connection: Connection):
    beneficiaries = await get_beneficiaries_without_referent(db_connection)

    admin_structures = groupBeneficiariesByAdminStructure(beneficiaries)

    for admin_structure in admin_structures:
        send_beneficiaries_without_referent_to_admin_structure_email(
            to_email=admin_structure[0], structures=admin_structure[1]
        )


def groupBeneficiariesByAdminStructure(
    beneficiaries: list[BeneficiaryWithAdminStructureEmail],
) -> list[tuple[str, list[StructureWithBeneficiaries]]]:
    return [
        (
            admin_structure_email,
            [
                StructureWithBeneficiaries(
                    name=structure_name,
                    beneficiaries=[
                        PersonWithDateOfBirth(
                            firstname=b.firstname,
                            lastname=b.lastname,
                            date_of_birth=b.date_of_birth,
                            orientation=b.orientation.get_label()
                            if b.orientation is not None
                            else None,
                        )
                        for b in structure_beneficiaries
                    ],
                )
                for structure_name, structure_beneficiaries in groupby(
                    admin_structure_beneficiaries, lambda b: b.structure_name
                )
            ],
        )
        for admin_structure_email, admin_structure_beneficiaries in groupby(
            beneficiaries, lambda b: b.admin_structure_email
        )
    ]
