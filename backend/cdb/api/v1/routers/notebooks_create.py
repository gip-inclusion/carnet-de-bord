from fastapi import APIRouter, Depends, Request
from fastapi.responses import JSONResponse
from gql.dsl import DSLSchema
from pydantic import BaseModel

from cdb.api.db.crud.beneficiary import (
    get_insert_beneficiary_mutation_gql,
    insert_notebook_creation_gql,
    search_beneficiary_by_nir_query_gql,
)
from cdb.api.db.graphql.get_client import gql_client_backend_only
from cdb.api.schema_gql import schema
from cdb.api.v1.dependencies import verify_secret_token
from cdb.api.v1.payloads.notebook import CreateNotebookActionPayload


class CreatedNotebook(BaseModel):
    notebookId: str


router = APIRouter(dependencies=[Depends(verify_secret_token)])


@router.post("", status_code=201)
async def create_beneficiary_notebook(
    _: Request,
    payload: CreateNotebookActionPayload,
):
    """
    This endpoint aims to create a beneficiary and its notebook from
    an external partner (**like RDV-Insertion**).

    This endpoint will:
    - ensure there is no existing beneficiary (nir shall be unique)
    - create beneficiary entity
    - create notebook entity
    - create beneficiary_structure to hold the relation between
        a structure and a beneficiary
    """
    DSLSchema(schema=schema)
    """
        we use and admin client to search a beneficiary from their nir
        to be sure to find them.
    """
    async with gql_client_backend_only() as session:
        response = await session.execute(
            search_beneficiary_by_nir_query_gql(),
            variable_values={"nir": payload.input.notebook.nir},
        )
        beneficiaries = response.get("beneficiaries")
        if isinstance(beneficiaries, list) and len(beneficiaries) > 0:
            notebookId = beneficiaries[0]["notebook"]["id"]
            if beneficiaries[0].get("deploymentId") != payload.session_variables.get(
                "x-hasura-deployment-id"
            ):
                return JSONResponse(
                    status_code=400,
                    content={
                        "message": "found notebook from a different deployment",
                        "extensions": {
                            "error_code": 400,
                        },
                    },
                )
            return JSONResponse(
                status_code=409,
                content={
                    "message": "notebook already exists",
                    "extensions": {
                        "error_code": 409,
                        "notebookId": notebookId,
                        "input": payload.input.notebook.dict(),
                    },
                },
            )

    async with gql_client_backend_only(
        session_variables=payload.session_variables
    ) as session:
        response = await session.execute(
            get_insert_beneficiary_mutation_gql(),
            variable_values=payload.input.notebook.dict(by_alias=True),
        )
        notebook_id = response["insert_beneficiary_one"]["notebook"]["id"]
        await session.execute(
            insert_notebook_creation_gql(),
            variable_values={
                "accountId": payload.session_variables.get("x-hasura-user-id"),
                "notebookId": notebook_id,
                "source": "rdvi",
            },
        )

    return CreatedNotebook(notebookId=notebook_id)
