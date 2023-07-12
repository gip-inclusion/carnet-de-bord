from uuid import UUID

from fastapi import APIRouter, Depends, Request
from gql.dsl import DSLMutation, DSLSchema, dsl_gql
from pydantic import BaseModel

from cdb.api.db.crud.notebook_focus import get_insert_notebook_focus_mutation
from cdb.api.db.graphql.get_client import gql_client_backend_only
from cdb.api.schema_gql import schema
from cdb.api.v1.dependencies import verify_secret_token
from cdb.api.v1.payloads.notebook_focus import CreateNotebookFocusActionPayload


class CreatedNotebookFocus(BaseModel):
    notebookId: UUID


router = APIRouter(dependencies=[Depends(verify_secret_token)])


@router.post("", status_code=201)
async def create_notebook_focus(
    _: Request,
    payload: CreateNotebookFocusActionPayload,
):
    """
    This endpoint aims to create a notebook focus
    """
    dsl_schema = DSLSchema(schema=schema)
    """
        we use and admin client to search a beneficiary from their nir
        to be sure to find them.
    """
    async with gql_client_backend_only(
        session_variables=payload.session_variables
    ) as session:
        mutation = get_insert_notebook_focus_mutation(
            dsl_schema=dsl_schema,
            notebook_focus=payload.input,
        )
        response = await session.execute(dsl_gql(DSLMutation(**mutation)))

    return CreatedNotebookFocus(
        notebookId=response["create_notebook_focus"]["notebook_focus"]["id"]
    )
