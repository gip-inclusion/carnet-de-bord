from itertools import groupby

from fastapi import APIRouter, BackgroundTasks, Depends

from cdb.api.core.emails import (
    send_beneficiaries_without_referent_to_admin_structure_email,
)
from cdb.api.core.init import connection
from cdb.api.db.crud.beneficiary import get_beneficiaries_without_referent
from cdb.api.db.models.admin_structure import (
    Beneficiary,
    NotifiedAdminStructure,
    Structure,
)
from cdb.api.db.models.beneficiary import BeneficiaryWithAdminStructureEmail
from cdb.api.db.models.email import PersonWithDateOfBirth, StructureWithBeneficiaries
from cdb.api.v1.dependencies import verify_secret_token

router = APIRouter(dependencies=[Depends(verify_secret_token)])


@router.post("/notify", response_model=list[NotifiedAdminStructure])
async def notify_admin_structures(
    background_tasks: BackgroundTasks,
    db=Depends(connection),
):
    beneficiaries = await get_beneficiaries_without_referent(db)

    admin_structures = groupBeneficiariesByAdminStructure(beneficiaries)

    response: list[NotifiedAdminStructure] = []

    for admin_structure in admin_structures:
        response.append(formatNotifiedAdminStructure(admin_structure))

        background_tasks.add_task(
            send_beneficiaries_without_referent_to_admin_structure_email,
            to_email=admin_structure[0],
            structures=admin_structure[1],
        )

    return response


def formatNotifiedAdminStructure(
    admin_structure: tuple[str, list[StructureWithBeneficiaries]]
) -> NotifiedAdminStructure:
    return NotifiedAdminStructure(
        email=admin_structure[0],
        structures=[
            Structure(
                name=structure.name,
                beneficiaries=[
                    Beneficiary(
                        firstname=beneficiary.firstname,
                        lastname=beneficiary.lastname,
                    )
                    for beneficiary in structure.beneficiaries
                ],
            )
            for structure in admin_structure[1]
        ],
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
