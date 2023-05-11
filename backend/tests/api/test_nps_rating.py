from datetime import datetime, timedelta, timezone
from uuid import UUID

from asyncpg.connection import Connection
from httpx import AsyncClient


def get_gql_json(score: int, account_id: UUID):
    return {
        "action": {"name": "create_nps_rating"},
        "input": {"score": score},
        "request_query": "",
        "session_variables": {"x-hasura-user-id": account_id},
    }


async def test_nps_rating(
    test_client: AsyncClient, db_connection: Connection, laure_loge_account_id: UUID
):
    response = await test_client.post(
        "/v1/nps-rating",
        json=get_gql_json(score=0, account_id=laure_loge_account_id),
        headers={"secret-token": "action_secret_token"},
    )
    assert response.status_code == 201
    row = await db_connection.fetchrow("SELECT * FROM nps_rating")
    assert len(row) == 4
    assert isinstance(row["id"], UUID)
    assert row["account_id"] == laure_loge_account_id
    assert row["score"] == 0


async def test_nps_rating_with_existing(
    test_client: AsyncClient, db_connection: Connection, laure_loge_account_id: UUID
):
    await db_connection.execute(
        "INSERT INTO nps_rating (account_id, created_at, score) VALUES ($1, $2, $3)",
        laure_loge_account_id,
        datetime.now(tz=timezone.utc) - timedelta(days=14),
        7,
    )
    response = await test_client.post(
        "/v1/nps-rating",
        json=get_gql_json(score=10, account_id=laure_loge_account_id),
        headers={"secret-token": "action_secret_token"},
    )
    assert response.status_code == 201
    row_count = await db_connection.fetchrow("SELECT COUNT(*) as count FROM nps_rating")
    assert row_count["count"] == 2
    row = await db_connection.fetchrow(
        "SELECT * FROM nps_rating ORDER BY created_at DESC"
    )
    assert len(row) == 4
    assert isinstance(row["id"], UUID)
    assert row["account_id"] == laure_loge_account_id
    assert row["score"] == 10


async def test_nps_rating_invalid_score(
    test_client: AsyncClient, db_connection: Connection, laure_loge_account_id: str
):
    response = await test_client.post(
        "/v1/nps-rating",
        # Over-promoter.
        json=get_gql_json(score=9001, account_id=laure_loge_account_id),
        headers={"secret-token": "action_secret_token"},
    )
    assert response.status_code == 422
    assert response.json() == {
        "detail": [
            {
                "ctx": {"limit_value": 10},
                "loc": ["body", "input", "score"],
                "msg": "ensure this value is less than or equal to 10",
                "type": "value_error.number.not_le",
            }
        ]
    }

    row = await db_connection.fetchrow("SELECT COUNT(*) AS count FROM nps_rating")
    assert len(row) == 1
    assert row["count"] == 0


async def test_nps_rating_double_submission(
    test_client: AsyncClient, db_connection: Connection, laure_loge_account_id: str
):
    row = await db_connection.fetchrow(
        """
        INSERT INTO nps_rating (account_id, score)
        VALUES ($1, $2)
        RETURNING id, created_at
        """,
        laure_loge_account_id,
        10,
    )
    rating_id = row["id"]
    created_at = row["created_at"]
    response = await test_client.post(
        "/v1/nps-rating",
        json=get_gql_json(score=0, account_id=laure_loge_account_id),
        headers={"secret-token": "action_secret_token"},
    )
    assert response.status_code == 403
    assert response.json() == {
        "detail": "Le dernier score NPS a été enregistré il y a moins de 14 jours.",
        "message": "Le dernier score NPS a été enregistré il y a moins de 14 jours.",
    }
    row = await db_connection.fetchrow("SELECT * FROM nps_rating")
    assert len(row) == 4
    assert row["id"], rating_id
    assert row["account_id"] == laure_loge_account_id
    assert row["score"] == 10
    assert row["created_at"] == created_at
