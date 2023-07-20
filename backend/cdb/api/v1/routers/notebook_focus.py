from fastapi import APIRouter, Depends, Request

from cdb.api.db.crud.notebook_focus import insert_notebook_focus
from cdb.api.db.graphql.get_client import gql_client_backend_only
from cdb.api.v1.dependencies import verify_secret_token
from cdb.api.v1.payloads.notebook_focus import (
    CreatedNotebookFocus,
    CreateNotebookFocusActionPayload,
)

router = APIRouter(dependencies=[Depends(verify_secret_token)])


@router.post("", status_code=201, response_model=CreatedNotebookFocus)
async def create_notebook_focus(
    _: Request,
    payload: CreateNotebookFocusActionPayload,
):
    """
    This endpoint aims to create a notebook focus
    """
    """
        we use and admin client to search a beneficiary from their nir
        to be sure to find them.
    """
    async with gql_client_backend_only(
        session_variables=payload.session_variables
    ) as session:
        return await insert_notebook_focus(session, payload.input)
