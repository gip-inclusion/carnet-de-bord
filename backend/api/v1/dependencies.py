import json

import jwt
from fastapi import Header, HTTPException, Request

from api.core.settings import settings
from api.db.models.role import RoleEnum


async def verify_jwt_token_header(
    request: Request,
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

    request.state.deployment_id = token["deploymentId"]
