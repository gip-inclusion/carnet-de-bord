import time

import sentry_sdk
import structlog
from fastapi import Request, Response
from uvicorn.protocols.utils import get_path_with_query_string

from api.core.init import create_app
from api.core.logging import setup_logging
from api.core.settings import settings

sentry_sdk.init(
    attach_stacktrace=True,
    dsn=settings.SENTRY_DSN,
    environment=settings.SENTRY_ENVIRONMENT,
)

setup_logging(json_logs=settings.LOG_AS_JSON, log_level=settings.LOG_LEVEL)
access_logger = structlog.stdlib.get_logger("api.access")

app = create_app()


@app.middleware("http")
async def logging_middleware(request: Request, call_next) -> Response:
    structlog.contextvars.clear_contextvars()

    start_time = time.perf_counter_ns()
    # If the call_next raises an error, we still want to return our own 500 response,
    # so we can add headers to it (process time, request ID...)
    response = Response(status_code=500)
    try:
        response = await call_next(request)
    except Exception:
        structlog.stdlib.get_logger("api.error").exception("Uncaught exception")
        raise
    finally:
        process_time = time.perf_counter_ns() - start_time
        status_code = response.status_code
        url = get_path_with_query_string(request.scope)
        client_host = request.client.host
        client_port = request.client.port
        http_method = request.method
        http_version = request.scope["http_version"]
        # Recreate the Uvicorn access log format, but add all parameters as structured information
        access_logger.info(
            f"""{client_host}:{client_port} - "{http_method} {url} HTTP/{http_version}" {status_code}""",
            http={
                "url": str(request.url),
                "status_code": status_code,
                "method": http_method,
                "version": http_version,
            },
            network={"client": {"ip": client_host, "port": client_port}},
            duration=process_time,
            response={
                "body": response,
            },
        )
        response.headers["X-Process-Time"] = str(process_time / 10**9)
        return response
