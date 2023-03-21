import logging
import re
from io import BytesIO
from typing import Tuple

import chardet
import magic
import numpy as np
import pandas as pd
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

from cdb.api.core.emails import send_invitation_email
from cdb.api.core.exceptions import InsertFailError
from cdb.api.core.init import connection
from cdb.api.db.crud.orientation_manager import create_orientation_manager_with_account
from cdb.api.db.models.account import AccountDBWithAccessKey
from cdb.api.db.models.orientation_manager import (
    OrientationManagerCsvRow,
    OrientationManagerDB,
    OrientationManagerResponseModel,
    map_csv_row,
    map_row_response,
)
from cdb.api.db.models.role import RoleEnum
from cdb.api.v1.dependencies import allowed_jwt_roles, extract_deployment_id

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

    mime_type: str = magic.from_descriptor(upload_file.file.fileno(), mime=True)

    if mime_type in [
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        "application/vnd.ms-excel",
    ]:

        contents = await upload_file.read()
        with BytesIO(contents) as data:
            df = pd.read_excel(
                data,
                header=0,
            )
    elif mime_type in ["text/plain", "text/csv"]:

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
            detail=(
                f"File type '{mime_type}' not supported. "
                "Allowed types are csv or excel",
            ),
        )

    df = df.replace({np.nan: None})
    row: Series
    result: list[OrientationManagerResponseModel] = []

    for _, row in df.iterrows():
        try:
            csv_row: OrientationManagerCsvRow = map_csv_row(row)
            account_manager_tuple: Tuple[
                AccountDBWithAccessKey, OrientationManagerDB
            ] | None = await create_orientation_manager_with_account(
                connection=db, deployment_id=deployment_id, data=csv_row
            )

            if not account_manager_tuple:
                raise InsertFailError("imsert orientation manager failed")

            account, _ = account_manager_tuple
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
        except KeyError as err:
            logging.error("Key error: %s", err)
            response_row: OrientationManagerResponseModel = map_row_response(
                row, valid=False, error=f"clé manquante {err}"
            )
        except ValidationError as err:
            [error] = err.errors()
            logging.error("Validation error %s", error)
            response_row: OrientationManagerResponseModel = map_row_response(
                row, valid=False, error=error["msg"]
            )
        except UniqueViolationError as err:
            logging.error("Uniqueness error: %s", err)
            response_row: OrientationManagerResponseModel = map_row_response(
                row, valid=False, error=re.sub(r"\nDETAIL.*$", "", str(err))
            )
        except InsertFailError as err:
            logging.error("Import error: %s %s", type(err).__name__, err.args)
            response_row: OrientationManagerResponseModel = map_row_response(
                row, valid=False, error="erreur inconnue"
            )

        result.append(response_row)

    return result
