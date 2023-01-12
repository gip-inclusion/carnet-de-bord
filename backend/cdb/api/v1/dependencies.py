import json
from dataclasses import dataclass
from typing import List
from uuid import UUID

import jwt
from fastapi import Header, HTTPException, Request

from cdb.api.core.settings import settings
from cdb.api.db.models.role import RoleEnum


class allowed_jwt_roles:
    def __init__(self, allowed_roles: List[RoleEnum]) -> None:
        self.allowed_roles = allowed_roles

    def __call__(self, jwt_token: str | None = Header(default=None)) -> None:
        if not jwt_token:
            raise HTTPException(status_code=401, detail="Missing credentials")
        jwt_config = json.loads(settings.hasura_graphql_jwt_secret)
        token = jwt.decode(
            jwt_token, jwt_config["key"], algorithms=[jwt_config["type"]]
        )
        if token["role"] not in self.allowed_roles:
            raise HTTPException(
                status_code=403, detail="Operation forbidden to the given role"
            )


async def extract_deployment_id(
    request: Request, jwt_token: str | None = Header(default=None)
):
    if not jwt_token:
        raise HTTPException(status_code=401, detail="Missing credentials")
    jwt_config = json.loads(settings.hasura_graphql_jwt_secret)
    token = jwt.decode(jwt_token, jwt_config["key"], algorithms=[jwt_config["type"]])
    request.state.deployment_id = token["deploymentId"]


async def extract_authentified_account(
    request: Request, jwt_token: str | None = Header(default=None)
):
    if not jwt_token:
        raise HTTPException(status_code=401, detail="Missing credentials")
    jwt_config = json.loads(settings.hasura_graphql_jwt_secret)
    token = jwt.decode(jwt_token, jwt_config["key"], algorithms=[jwt_config["type"]])
    request.state.account = Account(
        token["id"], token["structureId"], token["deploymentId"]
    )


@dataclass
class Account:
    id: UUID
    structure_id: UUID | None
    deployment_id: UUID | None
