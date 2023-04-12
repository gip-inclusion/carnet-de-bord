import io
import mmap
import os
from typing import Any, Generator

from lxml import etree

current_dir = os.path.dirname(os.path.realpath(__file__))
parser = etree.XMLParser(remove_blank_text=True)


def validate_xml(data: io.BufferedReader) -> bool:
    xmlschema_doc = etree.parse(
        os.path.join(current_dir, "vrsb0801.xsd"), parser=parser
    )
    xmlschema = etree.XMLSchema(xmlschema_doc)
    xml_doc = etree.parse(data, parser=parser)
    xmlschema.assertValid(xml_doc)
    return True


class XMLTagStream:
    """
    Shamelessly copy from
    https://realpython.com/python-xml-parser/#explore-third-party-xml-parser-libraries
    It will extract an xml node from the xml file

    """

    def __init__(self, file: io.BufferedReader, tag_name, encoding="utf-8"):
        self.file = file
        self.stream = mmap.mmap(self.file.fileno(), 0, access=mmap.ACCESS_READ)
        self.tag_name = tag_name
        self.encoding = encoding
        self.start_tag = f"<{tag_name}>".encode(encoding)
        self.end_tag = f"</{tag_name}>".encode(encoding)

    def __enter__(self):
        return self

    def __exit__(self, *args, **kwargs):
        self.stream.close()

    def __iter__(self) -> Generator[etree._ElementTree, Any, Any]:
        end = 0
        while (begin := self.stream.find(self.start_tag, end)) != -1:
            end = self.stream.find(self.end_tag, begin)
            yield self.parse(self.stream[begin : end + len(self.end_tag)])

    def parse(self, chunk) -> etree._ElementTree:
        return etree.parse(io.StringIO(chunk.decode(self.encoding)), parser=parser)
