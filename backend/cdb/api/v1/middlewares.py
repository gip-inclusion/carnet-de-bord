import time

import structlog
from fastapi import Request, Response
from starlette.concurrency import iterate_in_threadpool
from uvicorn.protocols.utils import get_path_with_query_string

from cdb.api.core.logging import setup_logging
from cdb.api.core.settings import settings

setup_logging(json_logs=settings.LOG_AS_JSON, log_level=settings.LOG_LEVEL)
access_logger = structlog.stdlib.get_logger("api.access")


async def logging_middleware(request: Request, call_next) -> Response:
    structlog.contextvars.clear_contextvars()
    response = None
    start_time = time.perf_counter_ns()
    try:
        response = await call_next(request)
        return response

    finally:
        # If the call_next raises an error,
        # we still want to return our own 500 response
        # so we can add headers to it (process time, request ID...)
        process_time = time.perf_counter_ns() - start_time
        status_code = 500 if not response else response.status_code
        url = get_path_with_query_string(request.scope)
        client_host = request.client.host
        client_port = request.client.port
        http_method = request.method
        http_version = request.scope.get("http_version", "Not defined")
        if response is None:
            response_body = None
        else:
            response_body = [section async for section in response.body_iterator]
            response.body_iterator = iterate_in_threadpool(iter(response_body))
        # Recreate the Uvicorn access log format, but add all parameters as structured
        # information
        access_logger.info(
            f'{client_host}:{client_port} - "{http_method} {url} HTTP/{http_version}" {status_code}',  # noqa: E501
            http={
                "url": str(request.url),
                "status_code": status_code,
                "method": http_method,
                "version": http_version,
            },
            network={"client": {"ip": client_host, "port": client_port}},
            duration=process_time,
            response={
                "body": response_body[0].decode()
                if response_body and len(response_body) > 0
                else None,
            },
        )
