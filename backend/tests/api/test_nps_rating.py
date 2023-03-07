from datetime import datetime, timedelta, timezone
from uuid import UUID

pro_uuid = UUID("d0b8f314-5e83-4535-9360-60f29dcfb5c8")


async def test_nps_rating(test_client, db_connection, get_professional_jwt):
    request_start = datetime.now(tz=timezone.utc)
    response = test_client.post(
        "/v1/nps-rating/create",
        json={"score": 0},
        headers={"jwt-token": get_professional_jwt},
    )
    request_end = datetime.now(tz=timezone.utc)
    assert response.status_code == 201
    row = await db_connection.fetchrow("SELECT * FROM nps_rating")
    assert len(row) == 4
    assert isinstance(row["id"], UUID)
    assert row["account_id"] == pro_uuid
    assert row["score"] == 0
    assert request_start < row["created_at"] < request_end


async def test_nps_rating_with_existing(
    test_client, db_connection, get_professional_jwt
):
    await db_connection.execute(
        "INSERT INTO nps_rating (account_id, created_at, score) VALUES ($1, $2, $3)",
        pro_uuid,
        datetime.now() - timedelta(days=14),
        7,
    )
    request_start = datetime.now(tz=timezone.utc)
    response = test_client.post(
        "/v1/nps-rating/create",
        json={"score": 10},
        headers={"jwt-token": get_professional_jwt},
    )
    request_end = datetime.now(tz=timezone.utc)
    assert response.status_code == 201
    row_count = await db_connection.fetchrow("SELECT COUNT(*) as count FROM nps_rating")
    assert row_count["count"] == 2
    row = await db_connection.fetchrow(
        "SELECT * FROM nps_rating ORDER BY created_at DESC"
    )
    assert len(row) == 4
    assert isinstance(row["id"], UUID)
    assert row["account_id"] == pro_uuid
    assert row["score"] == 10
    assert request_start < row["created_at"] < request_end


async def test_nps_rating_invalid_score(
    test_client, db_connection, get_professional_jwt
):
    response = test_client.post(
        "/v1/nps-rating/create",
        json={"score": 9001},  # Over-promoter.
        headers={"jwt-token": get_professional_jwt},
    )
    assert response.status_code == 422
    assert response.json() == {
        "detail": [
            {
                "ctx": {"limit_value": 10},
                "loc": ["body", "score"],
                "msg": "ensure this value is less than or equal to 10",
                "type": "value_error.number.not_le",
            }
        ]
    }

    row = await db_connection.fetchrow("SELECT COUNT(*) AS count FROM nps_rating")
    assert len(row) == 1
    assert row["count"] == 0


async def test_nps_rating_double_submission(
    test_client, db_connection, get_professional_jwt
):
    row = await db_connection.fetchrow(
        "INSERT INTO nps_rating (account_id, score) VALUES ($1, $2) RETURNING id, created_at",
        pro_uuid,
        10,
    )
    rating_id = row["id"]
    created_at = row["created_at"]
    response = test_client.post(
        "/v1/nps-rating/create",
        json={"score": 0},
        headers={"jwt-token": get_professional_jwt},
    )
    assert response.status_code == 403
    assert response.json() == {
        "detail": "Le dernier score NPS a été enregistré il y a moins de 14 jours."
    }
    row = await db_connection.fetchrow("SELECT * FROM nps_rating")
    assert len(row) == 4
    assert row["id"], rating_id
    assert row["account_id"] == pro_uuid
    assert row["score"] == 10
    assert row["created_at"] == created_at
