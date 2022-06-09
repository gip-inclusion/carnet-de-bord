import logging
from io import BytesIO
from uuid import UUID

import magic
import numpy as np
import pandas as pd
from asyncpg.connection import Connection
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

from api.core.emails import orientation_manager_account_creation_email
from api.core.init import connection
from api.db.crud.account import insert_orientation_manager_account
from api.db.crud.orientation_manager import insert_orientation_manager
from api.db.models.account import AccountDB
from api.db.models.orientation_manager import (
    OrientationManagerCsvRow,
    OrientationManagerResponseModel,
    map_csv_row,
    map_row_response,
)
from api.sendmail import send_mail
from api.v1.dependencies import verify_jwt_token_header

FORMAT = "[%(asctime)s:%(filename)s:%(lineno)s - %(funcName)20s() ] %(message)s"
logging.basicConfig(level=logging.INFO, format=FORMAT)


router = APIRouter(dependencies=[Depends(verify_jwt_token_header)])


# @router.post("/orientation_manager", response_model=OrientationManagerResponseModel)
@router.post("/orientation_manager")
async def create_upload_file(
    upload_file: UploadFile,
    request: Request,
    background_tasks: BackgroundTasks,
    db=Depends(connection),
):

    file_info: magic.FileMagic = magic.detect_from_fobj(upload_file.file)

    if file_info.mime_type in [
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        "application/vnd.ms-excel",
    ]:
        with BytesIO(contents) as data:
            df = pd.read_csv(
                data,
                header=0,
                skip_blank_lines=True,
                encoding="utf-8",
            )
    elif file_info.mime_type in ["text/plain", "text/csv"]:
        contents = await upload_file.read()
        with BytesIO(contents) as data:
            df = pd.read_csv(
                data, header=0, skip_blank_lines=True, encoding="utf-8", sep=";"
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
            deployment_id = request.state.deployment_id
            csv_row: OrientationManagerCsvRow = await map_csv_row(row)
            account = await create_orientation_manager(
                connection=db, deployment_id=deployment_id, data=csv_row
            )
            background_tasks.add_task(
                send_invitation_email,
                email=csv_row.email,
                firstname=csv_row.firstname,
                lastname=csv_row.lastname,
                access_key=account.access_key,
            )
            response_row: OrientationManagerResponseModel = await map_row_response(
                row, valid=True
            )

        except ValidationError as e:
            logging.error(f"Validation error: {e.raw_errors}")
            response_row: OrientationManagerResponseModel = await map_row_response(
                row, valid=False, error=str(e.errors)
            )

        except Exception as e:
            logging.error(f"Import error: {e}")
            response_row: OrientationManagerResponseModel = await map_row_response(
                row, valid=False, error="erreur inconnue"
            )

        result.append(response_row)

    return result


async def create_orientation_manager(
    connection: Connection, deployment_id: UUID, data: OrientationManagerCsvRow
) -> AccountDB | None:
    try:
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
    except Exception as e:
        raise Exception(f"create orientation manager exception {e}")


def send_invitation_email(
    email: str, firstname: str | None, lastname: str | None, access_key: UUID
):
    message = orientation_manager_account_creation_email(
        email, firstname, lastname, access_key
    )
    send_mail(email, "Création de compte sur Carnet de bord", message)
