import json
from datetime import date, datetime
from uuid import UUID


class CustomEncoder(json.JSONEncoder):
    def default(self, obj):
        if isinstance(obj, UUID):
            # if the obj is uuid, we simply return the value of uuid
            return obj.hex

        if isinstance(obj, (datetime, date)):
            return obj.isoformat()

        return json.JSONEncoder.default(self, obj)
