from io import BytesIO

import chardet
import magic
import numpy as np
import pandas as pd
from fastapi import APIRouter, Depends, HTTPException, UploadFile
from pandas import DataFrame

from cdb.api.db.models.beneficiary import BeneficiaryCsvRowResponse
from cdb.api.db.models.beneficiary import map_csv_row as map_csv_row_beneficiary
from cdb.api.db.models.role import RoleEnum
from cdb.api.db.models.structure import StructureCsvRowResponse
from cdb.api.db.models.structure import map_csv_row as map_csv_row_structure
from cdb.api.v1.dependencies import allowed_jwt_roles, extract_deployment_id

manager_only = allowed_jwt_roles([RoleEnum.MANAGER])

router = APIRouter(dependencies=[Depends(manager_only), Depends(extract_deployment_id)])


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


async def file_to_json(upload_file: UploadFile) -> DataFrame:
    mime_type: str = magic.from_descriptor(upload_file.file.fileno(), mime=True)

    if mime_type in [
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        "application/vnd.ms-excel",
    ]:

        contents = await upload_file.read()
        with BytesIO(contents) as data:
            df = pd.read_excel(
                data, header=0, dtype=object, na_values="", keep_default_na=False
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
                dtype=object,
                na_values="",
                keep_default_na=False,
            )
    else:
        raise HTTPException(
            status_code=400,
            detail=(
                f"File type '{mime_type}' not supported. "
                "Allowed types are csv or excel"
            ),
        )

    data_frame = df.replace({np.nan: None})
    return data_frame
