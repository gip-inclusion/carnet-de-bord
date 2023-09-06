from uuid import UUID

from gql import gql
from gql.client import AsyncClientSession
from graphql import DocumentNode

from cdb.api.db.models.orientation_info import OrientationInfo


def parse_orientation_info_from_gql(orientation_info_response, with_new_referent):
    notebook = orientation_info_response.get("notebook", [{}])[0]

    return OrientationInfo(
        beneficiary=notebook.get("beneficiary"),
        former_referents=notebook.get("former_referents")
        if notebook.get("former_referents")
        else [],
        new_structure=orientation_info_response.get("newStructure"),
        new_referent=orientation_info_response.get("newReferent")[0]
        if with_new_referent and len(orientation_info_response.get("newReferent")) > 0
        else None,
        notebook=notebook.get("notebook"),
    )


async def get_orientation_info(
    gql_session: AsyncClientSession,
    notebook_id: UUID,
    structure_id: UUID,
    new_referent_account_id: UUID | None,
) -> OrientationInfo:
    with_new_referent = new_referent_account_id is not None
    orientation_info_response = await gql_session.execute(
        get_orientation_info_gql(),
        variable_values={
            "notebook_id": notebook_id,
            "structure_id": structure_id,
            "new_referent_account_id": new_referent_account_id,
            "with_new_referent": with_new_referent,
        },
    )
    return parse_orientation_info_from_gql(orientation_info_response, with_new_referent)


def get_orientation_info_gql() -> DocumentNode:
    return gql(
        """
query orientationInfos(
  $notebook_id: uuid!
  $structure_id: uuid!
  $with_new_referent: Boolean!
  $new_referent_account_id: uuid
) {
  notebook: notebook_public_view(where: { id: { _eq: $notebook_id } }) {
    notebook {
      notebookInfo { orientationSystem { name }}
    }
    beneficiary {
      id
      orientation_request: orientationRequest(
        where: { decidedAt: { _is_null: true } }
      ) {
        id
      }
      firstname
      lastname
      address1
      address2
      postalCode
      city
      cafNumber
      structures(where: { status: { _eq: "current" } }) {
        structureId
        structure { name }
      }
    }
    former_referents: members(
      where: { memberType: { _eq: "referent" }, active: { _eq: true } }
    ) {
      account {
        id
        professional {
          firstname
          lastname
          email
          structure {
            name
          }
        }
      }
    }
  }
  newStructure: structure_by_pk(id: $structure_id) {
    name
  }
  newReferent: professional(
    where: { account: { id: { _eq: $new_referent_account_id } } }
  ) @include(if: $with_new_referent) {
    email
    firstname
    lastname
    structure {
      name
    }
  }
}
"""
    )
