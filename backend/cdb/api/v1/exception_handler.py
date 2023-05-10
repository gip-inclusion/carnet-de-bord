import logging

from fastapi import HTTPException, Request
from starlette.responses import JSONResponse

logger = logging.getLogger(__name__)


async def http_exception_handler(request: Request, exception: HTTPException):
    logger.error(exception)

    error_message = (
        exception.detail
        if exception.status_code < 500
        else "Une erreur interne est survenue"
    )
    return JSONResponse(
        status_code=exception.status_code,
        content={"message": error_message, "detail": error_message},
    )
