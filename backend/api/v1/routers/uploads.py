import logging
from io import BytesIO
from uuid import UUID

import magic
import numpy as np
import pandas as pd
from asyncpg.connection import Connection
from fastapi import APIRouter, Depends, HTTPException, Request, UploadFile
from pandas.core.series import Series
from pydantic import ValidationError

from api.core.init import connection
from api.db.crud.orientation_manager import insert_orientation_manager
from api.db.models.orientation_manager import (
    OrientationManagerCsvRow,
    OrientationManagerResponseModel,
    map_csv_row,
    map_row_response,
)
from api.v1.dependencies import verify_jwt_token_header

router = APIRouter(dependencies=[Depends(verify_jwt_token_header)])


# @router.post("/orientation_manager", response_model=OrientationManagerResponseModel)
@router.post("/orientation_manager")
async def create_upload_file(
    upload_file: UploadFile,
    request: Request,
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
            await insert_orientation_manager(db, deployment_id, csv_row)
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
