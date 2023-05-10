import logging

from fastapi import HTTPException, Request
from starlette.responses import JSONResponse

logger = logging.getLogger(__name__)


async def http_exception_handler(request: Request, exception: HTTPException):
    logger.error(exception)
    return JSONResponse(
        status_code=exception.status_code,
        content={
            "message": "Une erreur interne est survenue",
        },
    )
