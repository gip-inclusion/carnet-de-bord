import io

import lxml.etree as etree
import pytest

from cdb.caf_msa.validate_xml import XMLTagStream, validate_xml


async def test_validate_incorrect_file(flux_mensuel_msa: io.BufferedReader):
    with pytest.raises(etree.DocumentInvalid):
        validate_xml(flux_mensuel_msa)


async def test_validate_correct_file(flux_quotidien_msa: io.BufferedReader):
    assert validate_xml(flux_quotidien_msa)


async def test_extract_data_using_xml_tag_stream(flux_mensuel_msa: io.BufferedReader):
    nbFoyer = 0
    with XMLTagStream(flux_mensuel_msa, "InfosFoyerRSA") as stream:
        for infosFoyer in stream:
            nbFoyer += 1
            nirPath = etree.XPath(
                "//Personne/Identification/NIR/text()", smart_strings=False
            )
            t = nirPath(infosFoyer)
            print(">>", t)

    assert nbFoyer == 2
