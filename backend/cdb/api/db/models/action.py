from datetime import datetime
from uuid import UUID

from pydantic import BaseModel

from cdb.api.db.models.account import AccountInfo


class Action(BaseModel):
    id: UUID
    action: str
    target_id: UUID
    status: str
    creator_id: UUID
    account_info: AccountInfo
    created_at: datetime
    updated_at: datetime
