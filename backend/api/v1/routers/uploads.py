import logging
from http.client import HTTPException
from io import BytesIO
from urllib.request import Request

import magic
import numpy as np
import pandas as pd
from fastapi import APIRouter, Depends, File, UploadFile
from pandas.core.series import Series

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
    upload_file: UploadFile = File(
        default="file", description="A file read as UploadFile"
    ),
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
        print("CSV")
        contents = await upload_file.read()
        with BytesIO(contents) as data:
            df = pd.read_csv(
                data, header=0, skip_blank_lines=True, encoding="utf-8", sep=";"
            )
    else:
        raise HTTPException(
            status_code=400,
            detail="file type not supported. Allowed types are csv or excel",
        )
    df = df.replace({np.nan: None})
    row: Series
    result: list[OrientationManagerResponseModel] = []
    for _, row in df.iterrows():
        try:
            csv_row: OrientationManagerCsvRow = await map_csv_row(row)
            await insert_charge_orientation(csv_row)
            response_row: OrientationManagerResponseModel = await map_row_response(
                row, valid=True
            )
        except Exception as e:
            logging.error(f"Import error: {e}")
            response_row: OrientationManagerResponseModel = await map_row_response(
                row, valid=False, error=" a pas marché"
            )

        result.append(response_row)

    return result


async def insert_charge_orientation(row):
    print("insert chargé orientation", row)
    pass
