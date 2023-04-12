import datetime
import hashlib
import json
import logging
from typing import Any, List
from uuid import UUID

import dateutil.parser
from fastapi import APIRouter, Depends
from gql.client import AsyncClientSession

from cdb.api.core.settings import settings
from cdb.api.db.crud.beneficiary import get_beneficiary_by_notebook_id_query
from cdb.api.db.crud.external_data import save_external_data_with_info
from cdb.api.db.crud.notebook_situation import (
    get_ref_situations_with_notebook_situations,
    save_notebook_situations,
)
from cdb.api.db.graphql.get_client import gql_client_backend_only
from cdb.api.db.models.external_data import ExternalSource
from cdb.api.domain.situation.situations import (
    SituationDifferences,
    merge_contraintes_to_situations,
)
from cdb.api.v1.dependencies import verify_secret_token
from cdb.api.v1.payloads.notebook import NotebookSituationInputPayload
from cdb.api.v1.payloads.socio_pro import SituationToAdd
from cdb.cdb_csv.json_encoder import CustomEncoder
from cdb.pe.models.contrainte import Contrainte
from cdb.pe.pole_emploi_client import PoleEmploiApiClient

logger = logging.getLogger(__name__)

router = APIRouter(dependencies=[Depends(verify_secret_token)])


@router.post("/refresh-situations-from-pole-emploi", status_code=200)
async def refresh_notebook_situations_from_pole_emploi(
    payload: NotebookSituationInputPayload,
):
    """
    Cet endpoint est le backend de l'action Hasura
    qui permet de récupérer les situations dans le SI
    de Pôle-Emploi via les API dédiées.
    """
    if (
        not settings.ENABLE_SITUATION_API
        or settings.PE_CLIENT_ID == ""
        or settings.PE_CLIENT_SECRET == ""
    ):
        return {"data_has_been_updated": False}

    notebook_id = payload.input.notebook_id

    async with gql_client_backend_only() as session:
        beneficiary = await get_single_beneficiary_of_notebook(session, notebook_id)
        data_has_been_updated = False

        if beneficiary and not are_data_fresh(beneficiary):
            data_has_been_updated = await call_pe(
                notebook_id,
                session,
                beneficiary,
            )

        return {"data_has_been_updated": data_has_been_updated}


async def get_single_beneficiary_of_notebook(
    session: AsyncClientSession, notebook_id: UUID
) -> dict | None:
    response = await session.execute(
        get_beneficiary_by_notebook_id_query(), {"notebook_id": notebook_id}
    )
    beneficiaries = response.get("beneficiaries")
    if isinstance(beneficiaries, list) and len(beneficiaries) == 1:
        return beneficiaries[0]
    return None


def are_data_fresh(beneficiary: dict) -> bool:
    external_data_infos: List[dict] | None = beneficiary.get("externalDataInfos")
    if external_data_infos:
        for data in external_data_infos:
            if is_fresh(data):
                return True
    return False


def is_fresh(external_data):
    creation_date = dateutil.parser.isoparse(external_data["created_at"])
    expiry_date = creation_date + datetime.timedelta(hours=1)
    now = datetime.datetime.now(tz=datetime.timezone.utc)
    return now <= expiry_date


async def save_contraintes(
    contraintes: List[Contrainte], beneficiary_id: UUID, session: AsyncClientSession
):
    await save_external_data_with_info(
        session,
        beneficiary_id,
        list_to_json_serializable(contraintes),
        ExternalSource.PE_IO,
    )


async def call_pe(
    notebook_id: UUID,
    session: AsyncClientSession,
    beneficiary: dict,
):
    contraintes: List[Contrainte] | None = await get_contraintes_pe(beneficiary)

    if contraintes is None:
        return False

    if (
        beneficiary.get("externalDataInfos")
        and beneficiary.get("externalDataInfos")[0].get("externalData").get("hash")
        == hashlib.sha256(
            str(list_to_json_serializable(contraintes)).encode()
        ).hexdigest()
    ):
        return False

    await save_contraintes(contraintes, beneficiary.get("id"), session)

    differences = await get_differences(contraintes, notebook_id, session)
    if differences.situations_to_add or differences.situations_to_delete:
        await save_differences(differences, notebook_id, session)

        return True

    return False


async def get_differences(contraintes, notebook_id, session) -> SituationDifferences:
    (
        ref_situations,
        notebook_situations,
    ) = await get_ref_situations_with_notebook_situations(session, notebook_id)
    return merge_contraintes_to_situations(
        contraintes, ref_situations, notebook_situations
    )


async def get_contraintes_pe(beneficiary) -> List[Contrainte] | None:
    pe_client = PoleEmploiApiClient(
        auth_base_url=settings.PE_AUTH_BASE_URL,
        base_url=settings.PE_BASE_URL,
        client_id=settings.PE_CLIENT_ID,
        client_secret=settings.PE_CLIENT_SECRET,
        scope=settings.PE_SCOPE,
    )
    beneficiary = await pe_client.search_beneficiary(
        nir=beneficiary["nir"], date_of_birth=beneficiary["dateOfBirth"]
    )
    if beneficiary and beneficiary.identifiant:
        return await pe_client.get_contraintes(beneficiary.identifiant)


async def save_differences(differences: SituationDifferences, notebook_id, session):
    await save_notebook_situations(
        session,
        notebook_id,
        [
            json.loads(
                json.dumps(
                    SituationToAdd(
                        notebookId=notebook_id,
                        situationId=situation.situation_id,
                        createdAt=situation.created_at,
                    ).dict(),
                    cls=CustomEncoder,
                )
            )
            for situation in differences.situations_to_add
        ],
        differences.situations_to_delete,
    )


def list_to_json_serializable(items) -> List[Any]:
    return [to_json_serializable(item.dict()) for item in items]


def to_json_serializable(to_serialize) -> Any:
    return json.loads(
        json.dumps(
            to_serialize,
            cls=CustomEncoder,
        )
    )
