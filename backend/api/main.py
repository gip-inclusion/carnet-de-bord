import logging

import sentry_sdk
from pythonjsonlogger import jsonlogger

from api.core.init import create_app
from api.core.settings import settings

logging.basicConfig(level=settings.LOG_LEVEL, format=settings.LOG_FORMAT)
logger = logging.getLogger()
logHandler = logging.StreamHandler()
formatter = jsonlogger.JsonFormatter()
logHandler.setFormatter(formatter)
logger.addHandler(logHandler)

sentry_sdk.init(attach_stacktrace=True)

app = create_app()
