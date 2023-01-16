from pydantic import BaseModel


class CsvFieldError(BaseModel):
    key: str | None = None
    error: str
