from typing import List
from uuid import UUID

from gql import gql
from gql.client import AsyncClientSession
from graphql import DocumentNode
from pydantic import BaseModel


class Manager(BaseModel):
    id: UUID
    email: str
    firstname: str | None
    lastname: str | None


async def get_manager_by_account_id(
    gql_session: AsyncClientSession, account_id: UUID
) -> Manager | None:
    data: dict[str, List[dict]] = await gql_session.execute(
        query_manager_by_account_id(),
        variable_values={"id": account_id},
    )
    manager = data.get("manager")
    if isinstance(manager, List) and len(manager) == 1:
        return Manager.parse_obj(manager[0])


def query_manager_by_account_id() -> DocumentNode:
    return gql(
        """
query getManager($id:uuid!){
  manager(where: {account: {id: {_eq: $id}}}){
    id,
    email,
    firstname,
    lastname,
  }
}
        """
    )
