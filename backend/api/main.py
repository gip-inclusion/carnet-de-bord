import sentry_sdk

from api.core.init import create_app

sentry_sdk.init()

app = create_app()
