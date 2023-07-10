import logging
from typing import Tuple

from fastapi import APIRouter, BackgroundTasks, Depends, Request
from pydantic import BaseModel, Field

from cdb.api.core.exceptions import ImportFailError
from cdb.api.core.init import connection
from cdb.api.db.crud.admin_structure import (
    create_admin_structure_with_account,
    get_admin_structure_by_email,
    insert_admin_structure_structure,
)
from cdb.api.db.crud.structure import get_structure_by_name, insert_structure
from cdb.api.db.models.account import AccountDBWithAccessKey
from cdb.api.db.models.admin_structure import (
    AdminStructure,
    AdminStructureInput,
    AdminStructureStructureInput,
)
from cdb.api.db.models.role import RoleEnum
from cdb.api.db.models.structure import (
    CsvFieldError,
    Structure,
    StructureCsvRowResponse,
    StructureInputRow,
    map_input_row_to_structure_insert,
)
from cdb.api.v1.dependencies import allowed_jwt_roles, extract_deployment_id
from cdb.api.v1.routers.admin_structures import send_invitation_email

admin_only = allowed_jwt_roles([RoleEnum.MANAGER])

router = APIRouter(dependencies=[Depends(admin_only), Depends(extract_deployment_id)])


class StructuresInputRow(BaseModel):
    send_account_email: bool = Field(alias="sendAccountEmail", default=False)
    structures: list[StructureInputRow]


@router.post("/import", response_model=list[StructureCsvRowResponse])
async def create_structures(
    data: StructuresInputRow,
    request: Request,
    background_tasks: BackgroundTasks,
    db=Depends(connection),
):
    deployment_id = request.state.deployment_id
    result: list[StructureCsvRowResponse] = []
    for structure_row in data.structures:
        try:
            async with db.transaction():
                structure: Structure | None = await get_structure_by_name(
                    db, structure_row.name, deployment_id
                )

                # 1 create structure if not exist
                if not structure:
                    structure = await insert_structure(
                        db,
                        map_input_row_to_structure_insert(structure_row, deployment_id),
                    )
                if not structure:
                    raise ImportFailError("insert structure failed")

                # 2 Create admin structure if not exist
                admin_structure: AdminStructure | None = (
                    await get_admin_structure_by_email(
                        db,
                        structure_row.admin_email,
                    )
                )

                if not admin_structure:
                    account_admin_tuple: Tuple[
                        AccountDBWithAccessKey, AdminStructure
                    ] | None = await create_admin_structure_with_account(
                        db,
                        AdminStructureStructureInput(
                            admin=AdminStructureInput(
                                firstname=structure_row.admin_firstname,
                                lastname=structure_row.admin_lastname,
                                phone_numbers=structure_row.admin_phone_number,
                                position=structure_row.admin_position,
                                email=structure_row.admin_email,
                                deployment_id=deployment_id,
                            ),
                            structure_id=structure.id,
                        ),
                    )
                    if not account_admin_tuple:
                        raise ImportFailError("insert structure admin failed")

                    account, admin_structure = account_admin_tuple
                    if data.send_account_email:
                        logging.info(
                            "sending account creation mail to %s for structure %s",
                            admin_structure.email,
                            structure.name,
                        )
                        background_tasks.add_task(
                            send_invitation_email,
                            email=admin_structure.email,
                            firstname=admin_structure.firstname,
                            lastname=admin_structure.lastname,
                            access_key=account.access_key,
                        )

                # 3 Assign admin structure to structure

                uuid = await insert_admin_structure_structure(
                    connection=db,
                    admin_structure_id=admin_structure.id,
                    structure_id=structure.id,
                )
                if not uuid:
                    raise ImportFailError("add admin structure to structure failed")

                response_row = StructureCsvRowResponse(valid=True, data=structure_row)
        except ImportFailError as error:
            logging.error(error)
            response_row = StructureCsvRowResponse(
                row=structure_row.dict(),
                errors=[
                    CsvFieldError(
                        error=f"import structure {structure_row.name}: {error}"
                    )
                ],
                valid=False,
            )
        except Exception as error:
            logging.error("unhandled exception %s", error)
            response_row = StructureCsvRowResponse(
                row=structure_row.dict(),
                errors=[
                    CsvFieldError(
                        error=f"import structure {structure_row.name}: erreur inconnue"
                    )
                ],
                valid=False,
            )
        result.append(response_row)

    return result
