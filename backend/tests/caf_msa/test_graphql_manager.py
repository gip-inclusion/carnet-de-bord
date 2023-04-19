from uuid import UUID

from gql.client import AsyncClientSession

from cdb.api.db.graphql.manager import get_manager_by_account_id


async def test_get_manager_by_account_id(
    gql_manager_client: AsyncClientSession,
    get_manager_cd_93_account_id: UUID,
    get_manager_cd_93_id: UUID,
):
    manager = await get_manager_by_account_id(
        gql_manager_client, get_manager_cd_93_account_id
    )

    assert manager
    assert manager.id == get_manager_cd_93_id
    assert manager.firstname == "Agathe"
    assert manager.lastname == "DeBlouze"
    assert manager.email == "contact+cd93@carnetdebord.inclusion.beta.gouv.fr"
