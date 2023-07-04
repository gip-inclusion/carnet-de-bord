from __future__ import annotations

import abc
from abc import ABC
from datetime import datetime, timedelta, timezone
from uuid import UUID
from xmlrpc.client import Boolean

from dateutil.parser import isoparse
from pydantic import BaseModel

from cdb.api.db.crud.beneficiary import (
    get_beneficiary_by_notebook_id_query,
    update_diagnostic_fetch_date,
)
from cdb.api.db.graphql.get_client import gql_client_backend_only


class BeneficiaryResponse(BaseModel):
    diagnostic_fetched_at: str | None
    beneficiary_id: UUID
    nir: str | None
    date_of_birth: str
    last_diagnostic_hash: str | None

    def diagnostic_shoub_be_fetched(self) -> Boolean:
        if not self.diagnostic_fetched_at:
            return True
        creation_date = isoparse(self.diagnostic_fetched_at)
        expiry_date = creation_date + timedelta(hours=1)
        now = datetime.now(tz=timezone.utc)
        return now > expiry_date

    def has_pe_diagnostic(self) -> Boolean:
        return self.last_diagnostic_hash is not None


class BeneficiaryRepository(ABC):
    @abc.abstractmethod
    async def find_by_notebook_id(
        self, notebook_id: UUID
    ) -> BeneficiaryResponse | None:
        pass


class DbNotebookRepository(BeneficiaryRepository):
    async def save_diagnostic_fetched_date(self, notebook_id: UUID):
        async with gql_client_backend_only() as session:
            await session.execute(
                update_diagnostic_fetch_date(), {"notebook_id": notebook_id}
            )

    async def find_by_notebook_id(
        self, notebook_id: UUID
    ) -> BeneficiaryResponse | None:
        async with gql_client_backend_only() as session:
            response = await session.execute(
                get_beneficiary_by_notebook_id_query(), {"notebook_id": notebook_id}
            )
            notebook = response["notebook_by_pk"]
            if not notebook:
                return None
            return BeneficiaryResponse(
                diagnostic_fetched_at=notebook["diagnosticFetchedAt"],
                beneficiary_id=notebook["beneficiary"]["id"],
                nir=notebook["beneficiary"]["nir"],
                date_of_birth=notebook["beneficiary"]["dateOfBirth"],
                last_diagnostic_hash=self.extract_external_data_hash(
                    notebook["beneficiary"]
                ),
            )

    @staticmethod
    def extract_external_data_hash(beneficiary: dict) -> str | None:
        infos = beneficiary["externalDataInfos"]
        if isinstance(infos, list) and len(infos) == 1:
            info = infos[0]
            return info["externalData"]["hash"]
        else:
            return None
