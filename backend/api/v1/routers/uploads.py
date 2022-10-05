import logging
import re
from io import BytesIO
from uuid import UUID

import chardet
import magic
import numpy as np
import pandas as pd
from asyncpg.connection import Connection
from asyncpg.exceptions import UniqueViolationError
from fastapi import (
    APIRouter,
    BackgroundTasks,
    Depends,
    HTTPException,
    Request,
    UploadFile,
)
from pandas.core.series import Series
from pydantic import ValidationError

from api.core.init import connection
from api.core.settings import settings
from api.db.crud.account import insert_orientation_manager_account
from api.db.crud.orientation_manager import insert_orientation_manager
from api.db.models.account import AccountDB
from api.db.models.orientation_manager import (
    OrientationManagerCsvRow,
    OrientationManagerResponseModel,
    map_csv_row,
    map_row_response,
)
from api.db.models.role import RoleEnum

from api.v1.dependencies import allowed_jwt_roles, extract_deployment_id
from api.core.emails import send_invitation_email

logging.basicConfig(level=logging.INFO, format=settings.LOG_FORMAT)

manager_only = allowed_jwt_roles([RoleEnum.MANAGER])

router = APIRouter(dependencies=[Depends(manager_only), Depends(extract_deployment_id)])


# @router.post("/orientation_manager", response_model=OrientationManagerResponseModel)
@router.post("/orientation_manager")
async def create_upload_file(
    upload_file: UploadFile,
    request: Request,
    background_tasks: BackgroundTasks,
    db=Depends(connection),
):
    deployment_id = request.state.deployment_id

    file_info: magic.FileMagic = magic.detect_from_fobj(upload_file.file)

    if file_info.mime_type in [
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        "application/vnd.ms-excel",
    ]:

        contents = await upload_file.read()
        with BytesIO(contents) as data:
            df = pd.read_excel(
                data,
                header=0,
            )
    elif file_info.mime_type in ["text/plain", "text/csv"]:

        contents = await upload_file.read()
        charset = chardet.detect(contents)
        with BytesIO(contents) as data:
            df = pd.read_csv(
                data,
                header=0,
                encoding=charset["encoding"],
                skip_blank_lines=True,
                sep=";",
            )
    else:
        raise HTTPException(
            status_code=400,
            detail=f"File type '{file_info.mime_type}' not supported. Allowed types are csv or excel",
        )

    df = df.replace({np.nan: None})
    row: Series
    result: list[OrientationManagerResponseModel] = []

    for _, row in df.iterrows():
        try:
            csv_row: OrientationManagerCsvRow = map_csv_row(row)
            account = await create_orientation_manager(
                connection=db, deployment_id=deployment_id, data=csv_row
            )
            response_row: OrientationManagerResponseModel = map_row_response(
                row, valid=True
            )
            background_tasks.add_task(
                send_invitation_email,
                email=csv_row.email,
                firstname=csv_row.firstname,
                lastname=csv_row.lastname,
                access_key=account.access_key,
            )
        except KeyError as e:
            logging.error(f"Key error: {e}")
            response_row: OrientationManagerResponseModel = map_row_response(
                row, valid=False, error=f"clé manquante {e}"
            )
        except ValidationError as e:
            [error] = e.errors()
            logging.error("Validation error", error)
            response_row: OrientationManagerResponseModel = map_row_response(
                row, valid=False, error=error["msg"]
            )
        except UniqueViolationError as e:
            logging.error(f"Uniqueness error: {e}")
            response_row: OrientationManagerResponseModel = map_row_response(
                row, valid=False, error=re.sub(r"\nDETAIL.*$", "", str(e))
            )
        except Exception as e:
            logging.error(f"Import error: {type(e).__name__} {e.args}")
            response_row: OrientationManagerResponseModel = map_row_response(
                row, valid=False, error="erreur inconnue"
            )

        result.append(response_row)

    return result


async def create_orientation_manager(
    connection: Connection, deployment_id: UUID, data: OrientationManagerCsvRow
) -> AccountDB | None:
    async with connection.transaction():
        orientation_manager = await insert_orientation_manager(
            connection=connection, deployment_id=deployment_id, data=data
        )
        async with connection.transaction():
            account = await insert_orientation_manager_account(
                connection=connection,
                username=orientation_manager.email,
                confirmed=True,
                orientation_manager_id=orientation_manager.id,
            )
            return account


