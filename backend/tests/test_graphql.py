import pathlib

from cdb.graphql import generate_schema_module


async def test_hasura_codegen_is_up_to_date():
    current_file = pathlib.Path(__file__)
    backend_module_dir = current_file.parent.parent
    generated_module_path = (
        backend_module_dir / "cdb" / "api" / "_gen" / "schema_gql.py"
    )

    schema_module = await generate_schema_module()
    assert generated_module_path.read_text() == schema_module
