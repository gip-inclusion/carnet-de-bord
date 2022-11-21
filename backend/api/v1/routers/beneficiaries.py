import logging
from uuid import UUID

from asyncpg.connection import Connection
from fastapi import APIRouter, Depends, Request
from pydantic import BaseModel

from api.core.exceptions import InsertFailError, UpdateFailError
from api.core.init import connection
from api.db.crud.beneficiary import (
    create_beneficiary_with_notebook_and_referent,
    get_beneficiaries_like,
    update_beneficiary,
)
from api.db.crud.notebook import update_notebook
from api.db.crud.notebook_info import insert_or_update_need_orientation
from api.db.crud.wanted_job import insert_wanted_jobs
from api.db.models.beneficiary import (
    Beneficiary,
    BeneficiaryCsvRowResponse,
    BeneficiaryImport,
    is_same_name,
)
from api.db.models.csv import CsvFieldError
from api.db.models.role import RoleEnum
from api.v1.dependencies import allowed_jwt_roles, extract_deployment_id

manager_only = allowed_jwt_roles([RoleEnum.MANAGER])
router = APIRouter(dependencies=[Depends(manager_only), Depends(extract_deployment_id)])
logger = logging.getLogger(__name__)


class BeneficiaryImportResult(BaseModel):
    beneficiary: UUID | None
    action: str
    error: str | None


class BeneficiariesImportResult(BaseModel):
    uuid: UUID
    result: list[BeneficiaryCsvRowResponse]


class BeneficiariesImportInput(BaseModel):
    need_orientation: bool = False
    beneficiaries: list[BeneficiaryImport]


@router.post("/bulk", response_model=list[BeneficiaryCsvRowResponse])
async def import_beneficiaries(
    data: BeneficiariesImportInput,
    request: Request,
    db=Depends(connection),
) -> list[BeneficiaryCsvRowResponse]:

    deployment_id: UUID = UUID(request.state.deployment_id)
    result = [
        await import_beneficiary(db, beneficiary, deployment_id, data.need_orientation)
        for beneficiary in data.beneficiaries
    ]
    return result


async def import_beneficiary(
    db: Connection,
    beneficiary: BeneficiaryImport,
    deployment_id: UUID,
    need_orientation: bool,
) -> BeneficiaryCsvRowResponse:
    async with db.transaction():
        try:
            records: list[Beneficiary] = await get_beneficiaries_like(
                db, beneficiary, deployment_id
            )
            if no_matching_beneficiary(records):
                beneficiary_id = await create_beneficiary_with_notebook_and_referent(
                    connection=db,
                    beneficiary=beneficiary,
                    deployment_id=deployment_id,
                    need_orientation=need_orientation,
                )

                if not beneficiary_id:
                    raise UpdateFailError(f"fail to insert beneficiary {records[0].id}")

                logger.info("inserted new beneficiary %s", beneficiary_id)
                return BeneficiaryCsvRowResponse(valid=True, data=beneficiary)

            elif one_matching_beneficiary(records, beneficiary):
                # pour chaque ligne, on renvoie une liste de tuple [nom, valeur] si valeur != none
                fieldsToUpdate = [
                    (fieldname, value)
                    for (fieldname, value) in beneficiary.dict().items()
                    if value is not None
                ]
                beneficiary_id = await update_beneficiary(
                    db, fieldsToUpdate, records[0].id
                )
                if not beneficiary_id:
                    raise UpdateFailError(f"fail to insert beneficiary {records[0].id}")

                notebook_id: UUID | None = await update_notebook(
                    db, beneficiary_id, fieldsToUpdate
                )
                if notebook_id:
                    await insert_or_update_need_orientation(
                        db, notebook_id, None, need_orientation
                    )
                    await insert_wanted_jobs(db, notebook_id, beneficiary)
                logger.info("updated existing beneficiary %s", beneficiary_id)

                return BeneficiaryCsvRowResponse(
                    valid=True, update=True, data=beneficiary
                )

            elif same_si_id_but_different_user_info(records, beneficiary):
                logger.info(
                    "block beneficiary creation as it is conflicting with existing beneficiaries(same id): %s",
                    [beneficiary.id for beneficiary in records],
                )
                return BeneficiaryCsvRowResponse(
                    row=beneficiary.dict(by_alias=True),
                    errors=[
                        CsvFieldError(
                            error="Un bénéficiaire existe déjà avec cet identifiant SI sur le territoire."
                        )
                    ],
                    valid=False,
                )
            else:
                # same user info but different si_id
                logger.info(
                    "block beneficiary creation as it is conflicting with existing beneficiaries(same lastname / firstname / date of birth): %s",
                    [beneficiary.id for beneficiary in records],
                )

                return BeneficiaryCsvRowResponse(
                    row=beneficiary.dict(by_alias=True),
                    errors=[
                        CsvFieldError(
                            error="Un bénéficiaire existe déjà avec ce nom/prénom/date de naissance sur le territoire."
                        )
                    ],
                    valid=False,
                )

        except InsertFailError as error:
            logging.error(error)
            return BeneficiaryCsvRowResponse(
                row=beneficiary.dict(by_alias=True),
                errors=[
                    CsvFieldError(
                        error=f"import beneficiary {beneficiary.internal_id}: {error}"
                    )
                ],
                valid=False,
            )
        except UpdateFailError as error:
            logging.error(error)
            return BeneficiaryCsvRowResponse(
                row=beneficiary.dict(by_alias=True),
                errors=[
                    CsvFieldError(
                        error=f"import beneficiary {beneficiary.internal_id}: {error}"
                    )
                ],
                valid=False,
            )
        except Exception as error:
            logging.error("unhandled exception %s", error)
            return BeneficiaryCsvRowResponse(
                row=beneficiary.dict(by_alias=True),
                errors=[
                    CsvFieldError(
                        error=f"import beneficiary {beneficiary.internal_id}: erreur inconnue"
                    )
                ],
                valid=False,
            )


def no_matching_beneficiary(records: list[Beneficiary]) -> bool:
    return len(records) == 0


def one_matching_beneficiary(
    records: list[Beneficiary], beneficiary: BeneficiaryImport
) -> bool:
    if len(records) != 1:
        return False
    matching_beneficiary = records[0]

    return (
        is_same_name(
            matching_beneficiary.firstname,
            beneficiary.firstname,
            matching_beneficiary.lastname,
            beneficiary.lastname,
        )
        and matching_beneficiary.date_of_birth == beneficiary.date_of_birth
        and matching_beneficiary.internal_id == beneficiary.internal_id
    )


def same_si_id_but_different_user_info(records, beneficiary: BeneficiaryImport) -> bool:
    matching_beneficiary = records[0]
    return matching_beneficiary.internal_id == beneficiary.internal_id and not (
        is_same_name(
            matching_beneficiary.firstname,
            beneficiary.firstname,
            matching_beneficiary.lastname,
            beneficiary.lastname,
        )
        and matching_beneficiary.date_of_birth == beneficiary.date_of_birth
    )
