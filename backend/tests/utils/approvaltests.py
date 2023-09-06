from pprint import pformat
from typing import Any

import approvaltests
from approvaltests import Options
from approvaltests.scrubbers.date_scrubber import create_regex_scrubber


def verify(data: Any, extension: str = ".txt"):
    approvaltests.verify(data, options=Options().for_file.with_extension(extension))


def verify_python(data: Any):
    approvaltests.verify(pformat(data))


isoformat_date_scrubber = create_regex_scrubber(
    r"\d{4}-\d{1,2}-\d{1,2}T\d{1,2}:\d{2}:\d{2}.\d{4,6}\+\d{2}:\d{2}",
    lambda t: f"<date{t}>",
)


def verify_as_json(data: Any):
    approvaltests.verify_as_json(
        data,
        options=Options()
        .for_file.with_extension(".json")
        .with_scrubber(isoformat_date_scrubber),
    )
