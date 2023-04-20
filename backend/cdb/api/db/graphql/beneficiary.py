import json
from datetime import date
from typing import List
from uuid import UUID

from gql import gql
from gql.client import AsyncClientSession
from graphql import DocumentNode
from pydantic import BaseModel, Field

from cdb.api.db.models.validator import (
    date_validator,
)
from cdb.caf_msa.parse_infos_foyer_rsa import CdbBeneficiaryInfos
from cdb.cdb_csv.json_encoder import CustomEncoder


class BeneficiaryRsaInfos(BaseModel):
    id: UUID
    right_rsa: str | None = Field(alias="rightRsa")
    rsa_closure_reason: str | None = Field(alias="rsaClosureReason")
    rsa_closure_date: date | None = Field(alias="rsaClosureDate")
    rsa_suspension_reason: str | None = Field(alias="rsaSuspensionReason")
    is_homeless: bool | None = Field(alias="isHomeless")
    subject_to_right_and_duty: bool | None = Field(alias="subjectToRightAndDuty")
    caf_number: str = Field(alias="cafNumber")

    _date_validator = date_validator("rsa_closure_date", pre=True)

    class Config:
        anystr_strip_whitespace = True
        allow_population_by_field_name = True


async def get_beneficiary_by_nir(
    gql_session: AsyncClientSession, nir: str
) -> BeneficiaryRsaInfos | None:
    beneficiary_object: dict[str, List[dict]] = await gql_session.execute(
        beneficiary_by_nir_request(),
        variable_values={"nir": nir},
    )
    return parse_beneficiaries(beneficiary_object)


async def update_beneficiary(
    gql_session: AsyncClientSession,
    id: UUID,
    beneficiary_infos: CdbBeneficiaryInfos,
    sha: str,
    external_data: dict,
) -> BeneficiaryRsaInfos | None:
    result: dict[str, dict] = await gql_session.execute(
        update_beneficiary_mutation(),
        variable_values={
            "id": str(id),
            "rsaInfos": beneficiary_infos.dict(),
            "hash": sha,
            # Hack @lionelb:
            # Using a custom encoder on gql save a string containing
            # the stringify version on the json
            # that's why we use a encode / decode strategy
            # to transform non serializable object into string
            # so final dict can be saved into jsonb field
            "externalData": json.loads(json.dumps(external_data, cls=CustomEncoder)),
        },
    )
    beneficiary = result.get("beneficiary")
    if beneficiary:
        return parse_beneficiary(beneficiary)


def parse_beneficiaries(data: dict[str, List[dict]]) -> BeneficiaryRsaInfos | None:
    beneficiaries = data.get("beneficiaries")
    if isinstance(beneficiaries, List) and len(beneficiaries) == 1:
        return parse_beneficiary(beneficiaries[0])


def parse_beneficiary(data: dict) -> BeneficiaryRsaInfos:
    return BeneficiaryRsaInfos.parse_obj(data)


def beneficiary_by_nir_request() -> DocumentNode:
    return gql(
        """
query beneficiary($nir: String!) {
  beneficiaries:get_beneficiaries_from_nir(args:{search_nir: $nir}){
    id
    rightRsa
    rsaClosureReason
    rsaClosureDate
    rsaSuspensionReason
    isHomeless
    subjectToRightAndDuty
    cafNumber
    lastname
  }
}
"""
    )


def update_beneficiary_mutation() -> DocumentNode:
    return gql(
        """
mutation update_beneficiary(
    $id: uuid!,
    $rsaInfos: beneficiary_set_input!,
    $externalData: jsonb!,
    $hash: String!
) {
  beneficiary: update_beneficiary_by_pk(pk_columns: {id: $id}, _set: $rsaInfos ) {
    id
    rightRsa
    rsaClosureReason
    rsaClosureDate
    rsaSuspensionReason
    isHomeless
    subjectToRightAndDuty
    cafNumber
    lastname
  }
  insert_external_data_info_one(object: {
    beneficiary_id: $id
    externalData: {
      data: {
        data: $externalData
        source: cafmsa
        hash: $hash
      }
    }
  }){
    external_data_id
  }
}
        """
    )
