import os
from uuid import UUID

from gql import gql
from gql.client import AsyncClientSession

from api.db.models.orientation_info import OrientationInfo


def parse_orientation_info_from_gql(orientation_info_response, with_new_referent):
    notebook = orientation_info_response["notebook"][0]

    return OrientationInfo(
        beneficiary=notebook["beneficiary"],
        former_referents=notebook["former_referents"]
        if notebook["former_referents"]
        else [],
        new_structure=orientation_info_response["newStructure"],
        new_referent=orientation_info_response["newReferent"][0]
        if with_new_referent and len(orientation_info_response["newReferent"]) > 0
        else None,
    )


async def get_orientation_info(
    gql_session: AsyncClientSession,
    notebook_id: UUID,
    structure_id: UUID,
    new_referent_account_id: UUID | None,
) -> OrientationInfo:
    with_new_referent = new_referent_account_id is not None
    orientation_info_response = await gql_session.execute(
        gql(load_gql_file()),
        variable_values={
            "notebook_id": str(notebook_id),
            "structure_id": str(structure_id),
            "new_referent_account_id": str(new_referent_account_id),
            "with_new_referent": with_new_referent,
        },
    )
    return parse_orientation_info_from_gql(orientation_info_response, with_new_referent)


def load_gql_file(path: str = os.path.dirname(__file__)):
    with open(os.path.join(path, "orientation_info.gql"), encoding="utf-8") as f:
        return f.read()
