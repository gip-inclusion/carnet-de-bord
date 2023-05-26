from fastapi import APIRouter, Depends, Request
from fastapi.responses import JSONResponse
from gql.dsl import DSLMutation, DSLQuery, DSLSchema, dsl_gql
from pydantic import BaseModel

from cdb.api._gen.schema_gql import schema
from cdb.api.db.crud.beneficiary import (
    get_insert_beneficiary_mutation,
    search_beneficiary_by_nir_query,
)
from cdb.api.db.graphql.get_client import gql_client_backend_only
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
    dsl_schema = DSLSchema(schema=schema)
    """
        we use and admin client to search a beneficiary from their nir
        to be sure to find them.
    """
    async with gql_client_backend_only() as session:
        query = search_beneficiary_by_nir_query(
            dsl_schema=dsl_schema, nir=payload.input.notebook.nir
        )
        response = await session.execute(dsl_gql(DSLQuery(**query)))
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
        mutation = get_insert_beneficiary_mutation(
            dsl_schema=dsl_schema,
            notebook=payload.input.notebook,
        )
        response = await session.execute(dsl_gql(DSLMutation(**mutation)))

    return CreatedNotebook(
        notebookId=response["create_beneficiary_with_notebook"]["notebook"]["id"]
    )
