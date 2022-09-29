import datetime
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
from api.db.models.role import RoleEnum
from api.db.models.structure import StructureCsvRowResponse, map_csv_row
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
    return [map_csv_row(row) for _, row in dataframe.iterrows()]


@router.post("/beneficiaries", response_model=list[list[ParseError | FieldValue]])
async def parse_beneficiaries(
    upload_file: UploadFile,
):
    dataframe = await file_to_json(upload_file)
    records = dataframe.to_dict(orient="records")
    return [validate_beneficiary(record) for record in records]


def validate_beneficiary(beneficiary: dict) -> list[ParseError | FieldValue]:
    if "AAH" in beneficiary:
        # Old mislabeled CSV column name for rqth. Kept for retrocompatibility.
        rqth = "AAH"
    else:
        rqth = "RQTH"
    if "Numéro allocaire CAF/MSA" in beneficiary:
        # Old mislabeled CSV column name for caf number. Kept for retrocompatibility.
        no_alloc_caf = "Numéro allocaire CAF/MSA"
    else:
        no_alloc_caf = "Numéro allocataire CAF/MSA"
    return [
        parse_field("Identifiant dans le SI*", beneficiary, validators=[mandatory]),
        parse_field("Prénom*", beneficiary, validators=[mandatory]),
        parse_field("Nom*", beneficiary, validators=[mandatory]),
        parse_field(
            "Date de naissance*", beneficiary, validators=[mandatory, date_format]
        ),
        parse_field("Lieu de naissance", beneficiary),
        parse_field("Téléphone", beneficiary),
        parse_field("Email", beneficiary),
        parse_field("Adresse", beneficiary),
        parse_field("Adresse (complément)", beneficiary),
        parse_field("Code postal", beneficiary),
        parse_field("Ville", beneficiary),
        parse_field("Situation", beneficiary),
        parse_field(no_alloc_caf, beneficiary),
        parse_field("Identifiant Pôle emploi", beneficiary),
        parse_field("Droits RSA", beneficiary),
        parse_field("Droits ARE", beneficiary),
        parse_field("Droits ASS", beneficiary),
        parse_field("Prime d'activité", beneficiary),
        parse_field(rqth, beneficiary),
        parse_field("Zone de mobilité", beneficiary),
        parse_field("Emploi recherché (code ROME)", beneficiary),
        parse_field("Niveau de formation", beneficiary),
        parse_field("Structure", beneficiary),
        parse_field("Accompagnateurs", beneficiary),
    ]


def parse_field(col_name: str, line, validators=[]):
    try:
        value = line[col_name]
        validation_errors = [check(value) for check in validators if check(value)]
        if not validation_errors:
            return FieldValue.parse_obj({"column_name": col_name, "value": value})
        else:
            return ParseError.parse_obj(
                {
                    "column_name": col_name,
                    "value": value,
                    "error_messages": validation_errors,
                },
            )

    except KeyError:
        return ParseError.parse_obj(
            {
                "column_name": col_name,
                "value": None,
                "error_messages": [f"Missing column {col_name}"],
            }
        )


def mandatory(field: str):
    if not field:
        return "A value must be provided"


def date_format(field: str):
    if field:
        try:
            datetime.datetime.strptime(field, "%Y-%m-%d")
        except ValueError:
            return "Incorrect date format, The date must be formated as: YYYY-MM-DD"


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

    data_frame = df.replace({np.nan: None})
    return data_frame
