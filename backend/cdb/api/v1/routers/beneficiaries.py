import logging
from functools import partial
from typing import Awaitable, Callable, List
from uuid import UUID

from asyncpg.connection import Connection
from fastapi import APIRouter, BackgroundTasks, Depends, Header, Request, UploadFile
from mypy_extensions import Arg
from pydantic import BaseModel

from cdb.api.core.exceptions import ImportFailError
from cdb.api.core.init import connection
from cdb.api.db.crud.beneficiary import (
    add_beneficiary_to_structure,
    get_beneficiaries_like,
    insert_beneficiary,
    update_beneficiary,
)
from cdb.api.db.crud.notebook import (
    insert_notebook,
    insert_notebook_member,
    update_notebook,
)
from cdb.api.db.crud.notebook_info import insert_or_update_need_orientation
from cdb.api.db.crud.professional import get_professional_by_email
from cdb.api.db.crud.professional_project import insert_professional_projects
from cdb.api.db.crud.structure import get_structure_by_name
from cdb.api.db.models.beneficiary import (
    Beneficiary,
    BeneficiaryCsvRowResponse,
    BeneficiaryImport,
    is_same_name,
)
from cdb.api.db.models.csv import CsvFieldError
from cdb.api.db.models.notebook_member import NotebookMember, NotebookMemberInsert
from cdb.api.db.models.professional import Professional
from cdb.api.db.models.role import RoleEnum
from cdb.api.db.models.structure import Structure
from cdb.api.v1.dependencies import (
    Account,
    allowed_jwt_roles,
    extract_authentified_account,
    extract_deployment_id,
)
from cdb.caf_msa.update_cafmsa_infos import (
    update_cafmsa_for_beneficiaries,
)

manager_only = allowed_jwt_roles([RoleEnum.MANAGER])
router = APIRouter(
    dependencies=[
        Depends(manager_only),
        Depends(extract_deployment_id),
        Depends(extract_authentified_account),
    ]
)
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


@router.post("/update-from-caf-msa", status_code=201)
async def import_caf_msa_xml(
    upload_file: UploadFile,
    request: Request,
    background_tasks: BackgroundTasks,
    authorization: str = Header(default=None),
) -> None:
    account: Account = request.state.account
    logging.info("Réception d'un fichier CAF/MSA")
    background_tasks.add_task(
        update_cafmsa_for_beneficiaries,
        account.id,
        authorization,
        upload_file.file,  # type: ignore
    )


class LineImport(BaseModel):
    beneficiary: BeneficiaryImport
    deployment_id: UUID
    need_orientation: bool


class IO(BaseModel):
    get_beneficiaries_like: Callable[
        [BeneficiaryImport, Arg(UUID, "deployment_id")], Awaitable[List[Beneficiary]]
    ]
    insert_beneficiary: Callable[
        [BeneficiaryImport, Arg(UUID, "deployment_id")], Awaitable[UUID | None]
    ]
    insert_notebook: Callable[
        [Arg(UUID, "notebook_id"), BeneficiaryImport], Awaitable[UUID | None]
    ]
    insert_or_update_need_orientation: Callable[
        [
            Arg(UUID, "notebook_id"),
            Arg(UUID, "orientation_system_id") | None,
            Arg(bool, "need_orientation"),
        ],
        Awaitable[None],
    ]
    insert_professional_projects: Callable[
        [Arg(UUID, "notebook_id"), BeneficiaryImport], Awaitable[None]
    ]
    get_structure_by_name: Callable[
        [str, Arg(UUID, "deployment_id")], Awaitable[Structure | None]
    ]
    get_professional_by_email: Callable[[str], Awaitable[Professional | None]]
    add_beneficiary_to_structure: Callable[
        [Arg(UUID, "beneficiary_id"), Arg(UUID, "structure_id"), Arg(str, "status")],
        Awaitable[UUID | None],
    ]
    insert_notebook_member: Callable[
        [NotebookMemberInsert], Awaitable[NotebookMember | None]
    ]
    update_beneficiary: Callable[
        [BeneficiaryImport, Arg(UUID, "beneficiary_id")], UUID | None
    ]
    update_notebook: Callable[
        [BeneficiaryImport, Arg(UUID, "beneficiary_id")], UUID | None
    ]


@router.post("/bulk", response_model=list[BeneficiaryCsvRowResponse])
async def import_beneficiaries(
    data: BeneficiariesImportInput,
    request: Request,
    db=Depends(connection),
) -> list[BeneficiaryCsvRowResponse]:
    deployment_id: UUID = UUID(request.state.deployment_id)
    io = create_io(db)
    create_line_import = partial(to_line_import, data.need_orientation, deployment_id)
    result = [
        await import_beneficiary(db, create_line_import(beneficiary), io)
        for beneficiary in data.beneficiaries
    ]
    return result


def to_line_import(
    need_orientation: bool, deployment_id: UUID, beneficiary: BeneficiaryImport
):
    return LineImport(
        beneficiary=beneficiary,
        deployment_id=deployment_id,
        need_orientation=need_orientation,
    )


def create_io(db):
    return IO(
        get_beneficiaries_like=partial(get_beneficiaries_like, db),
        insert_beneficiary=partial(insert_beneficiary, db),
        insert_notebook=partial(insert_notebook, db),
        insert_or_update_need_orientation=partial(
            insert_or_update_need_orientation, db
        ),
        insert_professional_projects=partial(insert_professional_projects, db),
        get_structure_by_name=partial(get_structure_by_name, db),
        get_professional_by_email=partial(get_professional_by_email, db),
        add_beneficiary_to_structure=partial(add_beneficiary_to_structure, db),
        insert_notebook_member=partial(insert_notebook_member, db),
        update_beneficiary=partial(update_beneficiary, db),
        update_notebook=partial(update_notebook, db),
    )


async def import_beneficiary(
    db: Connection, line: LineImport, io: IO
) -> BeneficiaryCsvRowResponse:
    async with db.transaction():
        return await handle_line_in_transaction(io, line)


async def handle_line_in_transaction(
    io: IO, line: LineImport
) -> BeneficiaryCsvRowResponse:
    try:
        return await try_to_import_one(line, io)

    except ImportFailError as error:
        logging.error(error)
        return to_error_response(line.beneficiary, error)
    except Exception as error:
        logging.exception("unhandled exception %s", error)
        return to_error_response(line.beneficiary, "erreur_inconnue")


async def try_to_import_one(line: LineImport, io: IO):
    matching_beneficiaries: list[Beneficiary] = await io.get_beneficiaries_like(
        line.beneficiary, line.deployment_id
    )

    if len(matching_beneficiaries) > 1:
        return fail_for_more_than_one_match(line, matching_beneficiaries)

    if len(matching_beneficiaries) == 0:
        beneficiary_id = await create_beneficiary_with_notebook_and_referent(line, io)
        logger.info("inserted new beneficiary %s", beneficiary_id)
        return BeneficiaryCsvRowResponse(valid=True, data=line.beneficiary)

    match = matching_beneficiaries[0]

    if eq_personal_data(line.beneficiary, match) and eq_si_id(
        line.beneficiary, line.deployment_id, match
    ):
        return await try_to_update_one(
            line.beneficiary, line.need_orientation, match.id, io
        )

    if eq_si_id(line.beneficiary, line.deployment_id, match):
        return await fail_for_conflicting_si_id(line, matching_beneficiaries)

    if eq_personal_data(line.beneficiary, match):
        return await fail_for_conflicting_personal_data(line, matching_beneficiaries)

    raise ImportFailError(
        "Erreur inconnue, on a trouvé un bénéficiaire "
        "mais ni les données personnelles ni les SI IDs "
        "ne correspondent"
    )


async def fail_for_conflicting_personal_data(line, matching_beneficiaries):
    # same user info but different si_id
    logger.info(
        "block beneficiary creation as it is conflicting with existing "
        "beneficiaries(same lastname / firstname / date of birth): %s",
        [beneficiary.id for beneficiary in matching_beneficiaries],
    )
    return to_error_response(
        line.beneficiary,
        (
            "Un bénéficiaire existe déjà avec ce nom/prénom/date "
            "de naissance sur le territoire."
        ),
    )


async def fail_for_conflicting_si_id(line, matching_beneficiaries):
    logger.info(
        "block beneficiary creation as it is conflicting with existing "
        "beneficiaries(same id): %s",
        [beneficiary.id for beneficiary in matching_beneficiaries],
    )
    return to_error_response(
        line.beneficiary,
        ("Un bénéficiaire existe déjà avec cet identifiant SI " "sur le territoire."),
    )


def fail_for_more_than_one_match(line, matching_beneficiaries):
    logger.info(
        "block beneficiary import, multiple beneficiaries found: %s",
        [beneficiary.id for beneficiary in matching_beneficiaries],
    )
    return to_error_response(
        line.beneficiary,
        (
            "Plusieurs bénéficiaires existent déjà avec ce nom/prénom/date "
            "de naissance sur le territoire."
        ),
    )


def contains_parens(value):
    return "(" in value or ")" in value


async def create_beneficiary_with_notebook_and_referent(
    line: LineImport, io: IO
) -> UUID:
    beneficiary_id: UUID | None = await io.insert_beneficiary(
        line.beneficiary, line.deployment_id
    )

    if not beneficiary_id:
        raise ImportFailError("insert beneficiary failed")

    new_notebook_id: UUID | None = await io.insert_notebook(
        beneficiary_id, line.beneficiary
    )

    if not new_notebook_id:
        raise ImportFailError("insert notebook failed")

    await io.insert_or_update_need_orientation(
        new_notebook_id, None, line.need_orientation
    )

    await io.insert_professional_projects(new_notebook_id, line.beneficiary)
    await add_referent_and_structure_to_beneficiary(
        beneficiary_id, new_notebook_id, line.beneficiary, line.deployment_id, io
    )
    logger.info("inserted new beneficiary %s", beneficiary_id)
    return beneficiary_id


async def add_referent_and_structure_to_beneficiary(
    beneficiary_id: UUID,
    notebook_id: UUID,
    beneficiary: BeneficiaryImport,
    deployment_id: UUID,
    io: IO,
):
    structure = None
    if beneficiary.structure_name:
        structure = await io.get_structure_by_name(
            beneficiary.structure_name, deployment_id
        )
        if structure is None:
            logger.info(
                "Trying to associate structure with beneficiary: "
                'structure "%s" does not exist',
                beneficiary.structure_name,
            )
            return
    referent = None
    if beneficiary.advisor_email:
        referent: Professional | None = await io.get_professional_by_email(
            beneficiary.advisor_email.strip()
        )
    if structure:
        await io.add_beneficiary_to_structure(beneficiary_id, structure.id, "current")
    elif referent:
        await io.add_beneficiary_to_structure(
            beneficiary_id, referent.structure_id, "current"
        )

    if referent and referent.account_id:
        # Si on a pu récupérer le compte du référent fourni, on l'ajoute dans le
        # groupe de suivi en tant que référent.
        if not structure or structure.id == referent.structure_id:
            referent_member = NotebookMemberInsert(
                notebook_id=notebook_id,
                account_id=referent.account_id,
                member_type="referent",
            )
            await io.insert_notebook_member(referent_member)
    else:
        # Si un référent est fourni mais qu'on ne le connaît pas, on ne fait rien.
        logger.info(
            "trying to create referent: no account with email: %s",
            beneficiary.advisor_email,
        )


def to_error_response(beneficiary, error):
    return BeneficiaryCsvRowResponse(
        row=beneficiary.dict(by_alias=True),
        errors=[CsvFieldError(error=str(error))],
        valid=False,
    )


async def try_to_update_one(beneficiary, need_orientation, target_id, io):
    beneficiary_id = await io.update_beneficiary(beneficiary, target_id)
    if not beneficiary_id:
        raise ImportFailError(f"failed to update beneficiary {target_id}")
    notebook_id: UUID | None = await io.update_notebook(beneficiary, beneficiary_id)
    if notebook_id:
        await io.insert_or_update_need_orientation(notebook_id, None, need_orientation)
        await io.insert_professional_projects(notebook_id, beneficiary)
    logger.info("updated existing beneficiary %s", beneficiary_id)
    return BeneficiaryCsvRowResponse(valid=True, update=True, data=beneficiary)


def eq_personal_data(beneficiary, matching_beneficiary):
    return (
        is_same_name(
            matching_beneficiary.firstname,
            beneficiary.firstname,
            matching_beneficiary.lastname,
            beneficiary.lastname,
        )
        and matching_beneficiary.date_of_birth == beneficiary.date_of_birth
    )


def eq_si_id(beneficiary, deployment_id, matching_beneficiary):
    return (
        matching_beneficiary.external_id == beneficiary.external_id
        and matching_beneficiary.deployment_id == deployment_id
    )
