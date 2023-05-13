from typing import Dict

from pydantic import BaseModel


class Action(BaseModel):
    name: str


class HasuraActionPayload(BaseModel):
    action: Action
    request_query: str
    session_variables: Dict[str, str]
