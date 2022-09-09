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
from pandas import DataFrame
from pandas.core.series import Series
from pydantic import Json, ValidationError

from api.core.emails import generic_account_creation_email
from api.core.init import connection
from api.core.settings import settings
from api.db.crud.account import insert_orientation_manager_account
from api.db.crud.orientation_manager import insert_orientation_manager
from api.db.models.account import AccountDB
from api.db.models.beneficiary import BeneficiaryImport
from api.db.models.orientation_manager import (
    OrientationManagerCsvRow,
    OrientationManagerResponseModel,
    map_csv_row,
    map_row_response,
)
from api.db.models.role import RoleEnum
from api.sendmail import send_mail
from api.v1.dependencies import allowed_jwt_roles, extract_deployment_id

logging.basicConfig(level=logging.INFO, format=settings.LOG_FORMAT)

manager_only = allowed_jwt_roles([RoleEnum.MANAGER])

router = APIRouter(
    dependencies=[
        # Depends(manager_only),
        # Depends(extract_deployment_id)
    ]
)


@router.post("/beneficiaries", response_model=list[BeneficiaryImport])
async def parse_beneficiaries(
    upload_file: UploadFile,
):
    dataframe = await file_to_json(upload_file)
    records = dataframe.to_dict(orient="records")
    return [validate(record) for record in records]


def validate(beneficiary: dict) -> BeneficiaryImport:
    if "RQTH" in beneficiary:
        rqth = beneficiary["RQTH"]
    else:
        rqth = beneficiary["AAH"]
    BeneficiaryImport.parse_obj(
        {
            "si_id": beneficiary["Identifiant dans le SI*"],
            "firstname": beneficiary["Prénom*"],
            "lastname": beneficiary["Nom*"],
            "date_of_birth": beneficiary["Date de naissance*"],
            "place_of_birth": beneficiary["Lieu de naissance*"],
            "phone_number": beneficiary["Téléphone"],
            "email": beneficiary["Email"],
            "address1": beneficiary["Adresse"],
            "address2": beneficiary["Adresse (complément)"],
            "postal_code": beneficiary["Code postal"],
            "city": beneficiary["Ville"],
            "work_situation": beneficiary["Situation"],
            "caf_number": beneficiary["Numéro allocaire CAF/MSA"],
            "pe_number": beneficiary["Identifiant Pôle emploi"],
            "right_rsa": beneficiary["Droits RSA"],
            "right_are": bool_of(beneficiary["Droits ARE"]),
            "right_ass": bool_of(beneficiary["Droits ASS"]),
            "right_bonus": bool_of(beneficiary["Prime d'activité"]),
            "right_rqth": bool_of(rqth),
            "geographical_area": beneficiary["Zone de mobilité"],
            "rome_code_description": beneficiary["Emploi recherché (code ROME)"],
            "education_level": beneficiary["Niveau de formation"],
            "structure_name": beneficiary["Structure"],
            "advisor_email": beneficiary["Accompagnateurs"],
        }
    )


def bool_of(string: str) -> bool | None:
    if string == None:
        None
    elif string.capitalize() == "OUI":
        True
    else:
        False


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
