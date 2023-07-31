import os

from graphql import build_schema

__all__ = ["schema"]

dir_path = os.path.dirname(os.path.realpath(__file__))

schema_paths = [
    os.path.join(dir_path, "../../../hasura/schema.graphql"),
    os.path.join(dir_path, "./schema.graphql"),
]

schema_path = [p for p in schema_paths if os.path.exists(p)][0]

with open(schema_path) as f:
    schema = build_schema(f.read())
