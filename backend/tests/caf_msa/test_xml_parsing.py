import io

import lxml.etree as etree
import pytest

from cdb.caf_msa.validate_xml import validate_xml


async def test_validate_incorrect_file(flux_quotidien_caf_invalid: io.BufferedReader):
    with pytest.raises(etree.DocumentInvalid):
        validate_xml(data=flux_quotidien_caf_invalid)
