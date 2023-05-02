import importlib.metadata

import sentry_sdk
from fastapi import FastAPI

from cdb.api.core.init import create_app
from cdb.api.core.settings import settings

sentry_sdk.init(
    attach_stacktrace=True,
    dsn=settings.SENTRY_DSN,
    environment=settings.SENTRY_ENVIRONMENT,
    release=importlib.metadata.version("cdb"),
)

app: FastAPI = create_app()
