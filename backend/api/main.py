import logging

import sentry_sdk
from pythonjsonlogger import jsonlogger

from api.core.init import create_app
from api.core.settings import settings

uvicorn_logger = logging.getLogger("uvicorn")
uvicorn_logger.removeHandler(uvicorn_logger.handlers[0])

logger = logging.getLogger()
logHandler = logging.StreamHandler()
logger.setLevel(settings.LOG_LEVEL)
formatter = jsonlogger.JsonFormatter()
logHandler.setFormatter(formatter)
logger.addHandler(logHandler)

sentry_sdk.init(attach_stacktrace=True)

app = create_app()
