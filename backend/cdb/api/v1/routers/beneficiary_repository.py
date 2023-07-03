from __future__ import annotations

import abc
import datetime
from abc import ABC
from uuid import UUID

import dateutil.parser
from pydantic import BaseModel

from cdb.api.db.crud.beneficiary import get_beneficiary_by_notebook_id_query
from cdb.api.db.graphql.get_client import gql_client_backend_only


class Beneficiary(BaseModel):
    class ExternalDataInfo(BaseModel):
        external_data_hash: str
        created_at: str
        updated_at: str

        def is_fresh(self):
            creation_date = dateutil.parser.isoparse(self.created_at)
            expiry_date = creation_date + datetime.timedelta(hours=1)
            now = datetime.datetime.now(tz=datetime.timezone.utc)
            return now <= expiry_date

    id: UUID
    nir: str
    date_of_birth: str
    latest_external_data: Beneficiary.ExternalDataInfo | None


class BeneficiaryRepository(ABC):
    @abc.abstractmethod
    async def find_by_notebook_id(self, notebook_id: UUID) -> Beneficiary | None:
        pass


class DbBeneficiaryRepository(BeneficiaryRepository):
    async def find_by_notebook_id(self, notebook_id: UUID) -> Beneficiary | None:
        async with gql_client_backend_only() as session:
            response = await session.execute(
                get_beneficiary_by_notebook_id_query(), {"notebook_id": notebook_id}
            )
            beneficiaries = response["beneficiaries"]
            if not isinstance(beneficiaries, list) or len(beneficiaries) != 1:
                return None
            beneficiary = beneficiaries[0]
            return Beneficiary(
                id=beneficiary["id"],
                nir=beneficiary["nir"],
                date_of_birth=beneficiary["dateOfBirth"],
                latest_external_data=(self.extract_external_data(beneficiary)),
            )

    @staticmethod
    def extract_external_data(beneficiary: dict):
        infos = beneficiary["externalDataInfos"]
        if isinstance(infos, list) and len(infos) == 1:
            info = infos[0]
            return Beneficiary.ExternalDataInfo(
                external_data_hash=info["externalData"]["hash"],
                created_at=info["created_at"],
                updated_at=info["updated_at"],
            )
        else:
            return None
