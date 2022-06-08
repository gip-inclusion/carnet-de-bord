from pydantic import BaseModel


class AccessToken(BaseModel):
    access_token: str
    scope: str
    token_type: str
    expires_in: int
