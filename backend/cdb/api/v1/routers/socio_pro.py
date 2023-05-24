from fastapi import APIRouter, Depends, Request

from cdb.api.db.graphql.get_client import gql_client_backend_only
from cdb.api.db.graphql.socio_pro import gql_variables, update_socio_pro_gql
from cdb.api.v1.dependencies import verify_secret_token
from cdb.api.v1.payloads.socio_pro import UpdateSocioProActionPayload

router = APIRouter(dependencies=[Depends(verify_secret_token)])


@router.post("/update")
async def update(_: Request, payload: UpdateSocioProActionPayload):
    """
    Update the socio pro information of a notebook.
    It will create a notebook_event that will keep track of the modifications performed
    """
    async with gql_client_backend_only(
        session_variables=payload.session_variables
    ) as session:
        await session.execute(
            update_socio_pro_gql,
            variable_values=gql_variables(payload.input),
        )
