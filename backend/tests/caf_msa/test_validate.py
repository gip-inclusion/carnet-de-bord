import io

import lxml.etree as etree
import pytest

from cdb.caf_msa.parse_infos_foyer_rsa import parse_infos_foyer_rsa
from cdb.caf_msa.validate_xml import XMLTagStream, validate_xml


async def test_validate_incorrect_file(flux_quotidien_caf_invalid: io.BufferedReader):
    with pytest.raises(etree.DocumentInvalid):
        validate_xml(flux_quotidien_caf_invalid)


async def test_validate_correct_file(flux_mensuel_caf: io.BufferedReader):
    assert validate_xml(flux_mensuel_caf)


async def test_extract_data_using_xml_tag_stream(flux_mensuel_caf: io.BufferedReader):
    foyers = []
    with XMLTagStream(flux_mensuel_caf, "InfosFoyerRSA") as stream:
        for infosFoyer in stream:
            try:
                foyers.append(parse_infos_foyer_rsa(infosFoyer))
            except Exception as error:
                print(error)
    assert len(foyers) == 2
