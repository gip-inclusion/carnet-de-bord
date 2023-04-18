import io
import os

from lxml import etree

current_dir = os.path.dirname(os.path.realpath(__file__))
parser = etree.XMLParser(remove_blank_text=True)


def validate_xml(data: io.BufferedReader) -> bool:
    data.seek(0)
    xmlschema_doc = etree.parse(
        os.path.join(current_dir, "vrsb0801.xsd"), parser=parser
    )
    xmlschema = etree.XMLSchema(xmlschema_doc)
    xml_doc = etree.parse(data, parser=parser)
    xmlschema.assertValid(xml_doc)

    return True
