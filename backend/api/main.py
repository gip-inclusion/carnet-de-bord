import sentry_sdk

from api.core.init import create_app

sentry_sdk.init(attach_stacktrace=True)

app = create_app()
