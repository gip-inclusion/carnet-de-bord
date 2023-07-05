import logging

from fastapi import HTTPException, Request
from gql.transport.exceptions import TransportQueryError
from starlette.responses import JSONResponse

logger = logging.getLogger(__name__)


async def http_exception_handler(_: Request, exception: HTTPException):
    logger.exception(exception)
    return JSONResponse(
        status_code=exception.status_code,
        content={"message": exception.detail, "detail": exception.detail},
    )


async def http_500_exception_handler(_: Request, exception: Exception):
    logger.exception(exception)
    error_message = "Une erreur interne est survenue"
    return JSONResponse(
        status_code=400,
        content={"message": error_message, "detail": error_message},
    )


# We handle these exceptions so Hasura Action never get 500 errors
async def gql_transport_exception_handler(_: Request, exception: TransportQueryError):
    logger.exception(exception)

    if exception.errors:
        error = exception.errors.pop()
        return JSONResponse(
            status_code=400,
            content=error,
        )

    return JSONResponse(
        status_code=400,
        content={
            "message": "Erreur dans la requete graphql",
            "extensions": {"error_code": 400},
        },
    )


def httpx_exception_handler(_: Request, exception: Exception):
    logger.exception(exception)
    error_message = "Une erreur interne est survenue"
    return JSONResponse(
        status_code=400,
        content={"message": error_message, "detail": error_message},
    )
