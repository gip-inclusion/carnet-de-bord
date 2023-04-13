from datetime import date
from typing import Any, Dict, Optional

from graphql import GraphQLScalarType, ValueNode
from graphql.utilities import value_from_ast_untyped


def serialize_date(value: Any) -> str:
    return value.format()


def parse_date_value(value: Any) -> date:
    return date.fromisoformat(value)


def parse_date_literal(
    value_node: ValueNode, variables: Optional[Dict[str, Any]] = None
) -> date:
    ast_value = value_from_ast_untyped(value_node, variables)
    return parse_date_value(ast_value)


DateScalar = GraphQLScalarType(
    name="date",
    serialize=serialize_date,
    parse_value=parse_date_value,
    parse_literal=parse_date_literal,
)
