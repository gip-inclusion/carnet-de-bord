import json

import jwt
from fastapi import Header, HTTPException
from strenum import StrEnum

from api.core.settings import settings


class RoleEnum(StrEnum):
    ADMIN_CDB = "admin_cdb"
    MANAGER = "manager"
    ADMIN_STRUCTURE = "admin_structure"
    ORIENTATION_MANAGER = "orientation_manager"
    PROFESSIONAL = "professional"
    BENEFICIARY = "beneficiary"


async def verify_jwt_token_header(
    jwt_token: str | None = Header(default=None),
):
    if not jwt_token:
        raise HTTPException(status_code=400, detail="Missing jwt token")

    jwt_config = json.loads(settings.hasura_graphql_jwt_secret)
    token = jwt.decode(jwt_token, jwt_config["key"], algorithms=[jwt_config["type"]])

    if token["role"] != RoleEnum.MANAGER:
        raise HTTPException(status_code=400, detail="Role not allowed")

    if not token["deploymentId"]:
        raise HTTPException(status_code=400, detail="DeploymentId not found")
