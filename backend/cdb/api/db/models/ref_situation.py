from datetime import datetime
from uuid import UUID

from pydantic import BaseModel


class RefSituation(BaseModel):
    id: UUID
    description: str
    theme: str


class NotebookSituation(BaseModel):
    id: UUID
    situationId: UUID
    createdAt: datetime
    deleteAt: datetime | None

    @staticmethod
    def selection_set():
        return """ { id situationId createdAt deletedAt } """

    @staticmethod
    def parse_list(situations):
        notebook_situations_parsed = []
        if situations:
            notebook_situations_parsed = [
                NotebookSituation.parse_obj(situation) for situation in situations
            ]
        return notebook_situations_parsed
