#!/usr/bin/env python3

import asyncio
import pathlib

from cdb.graphql import generate_schema_module

if __name__ == "__main__":
    current_file = pathlib.Path(__file__)
    cdb_module_dir = current_file.parent.parent
    outfile = cdb_module_dir / "api" / "_gen" / "schema_gql.py"
    schema_module = asyncio.run(generate_schema_module())
    outfile.write_text(schema_module)
