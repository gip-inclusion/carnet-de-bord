# JSONEncoder monkey patch to serialize UUID
from json import JSONEncoder
from uuid import UUID

old_default = JSONEncoder.default


def new_default(self, o):
    if isinstance(o, UUID):
        return str(o)
    return old_default(self, o)


JSONEncoder.default = new_default
