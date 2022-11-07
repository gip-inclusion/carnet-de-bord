import logging
from io import BytesIO

import chardet
import magic
import numpy as np
import pandas as pd
from fastapi import APIRouter, Depends, HTTPException, UploadFile
from pandas import DataFrame
from pydantic import BaseModel

from api.core.settings import settings
from api.db.models.beneficiary import BeneficiaryCsvRowResponse
from api.db.models.beneficiary import map_csv_row as map_csv_row_beneficiary
from api.db.models.role import RoleEnum
from api.db.models.structure import StructureCsvRowResponse
from api.db.models.structure import map_csv_row as map_csv_row_structure
from api.v1.dependencies import allowed_jwt_roles, extract_deployment_id

logging.basicConfig(level=logging.INFO, format=settings.LOG_FORMAT)

manager_only = allowed_jwt_roles([RoleEnum.MANAGER])

router = APIRouter(dependencies=[Depends(manager_only), Depends(extract_deployment_id)])


class FieldValue(BaseModel):
    column_name: str
    value: str | None


class ParseError(BaseModel):
    column_name: str
    value: str | None
    error_messages: list[str]


@router.post("/structures", response_model=list[StructureCsvRowResponse])
async def parse_structures(
    upload_file: UploadFile,
):
    dataframe = await file_to_json(upload_file)
    return [map_csv_row_structure(row) for _, row in dataframe.iterrows()]


@router.post("/beneficiaries", response_model=list[BeneficiaryCsvRowResponse])
async def parse_beneficiaries(
    upload_file: UploadFile,
):
    dataframe = await file_to_json(upload_file)
    return [map_csv_row_beneficiary(row) for _, row in dataframe.iterrows()]


async def file_to_json(
    upload_file: UploadFile,
) -> DataFrame:
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
                dtype=object,
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
                dtype=object,
            )
    else:
        raise HTTPException(
            status_code=400,
            detail=f"File type '{file_info.mime_type}' not supported. Allowed types are csv or excel",
        )

    data_frame = df.replace({np.nan: None})
    return data_frame
