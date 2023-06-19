from pprint import pformat
from typing import Any

import approvaltests
from approvaltests import Options


def verify(data: Any, extension: str = ".txt"):
    approvaltests.verify(data, options=Options().for_file.with_extension(extension))


def verify_python(data: Any):
    approvaltests.verify(pformat(data))


def verify_as_json(data: Any):
    approvaltests.verify_as_json(
        data, options=Options().for_file.with_extension(".json")
    )
