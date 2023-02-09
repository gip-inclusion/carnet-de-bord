from datetime import datetime, timedelta
from uuid import UUID

pro_uuid = UUID("f29ca78a-4719-4658-8d19-48d3df9178b5")


async def test_nps_rating(test_client, db_connection, laure_loge_jwt):
    response = await test_client.post(
        "/v1/nps-rating",
        json={"score": 0},
        headers={"jwt-token": laure_loge_jwt},
    )
    assert response.status_code == 201
    row = await db_connection.fetchrow("SELECT * FROM nps_rating")
    assert len(row) == 4
    assert isinstance(row["id"], UUID)
    assert row["account_id"] == pro_uuid
    assert row["score"] == 0


async def test_nps_rating_with_existing(test_client, db_connection, laure_loge_jwt):
    await db_connection.execute(
        "INSERT INTO nps_rating (account_id, created_at, score) VALUES ($1, $2, $3)",
        pro_uuid,
        datetime.now() - timedelta(days=14),
        7,
    )
    response = await test_client.post(
        "/v1/nps-rating",
        json={"score": 10},
        headers={"jwt-token": laure_loge_jwt},
    )
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


async def test_nps_rating_invalid_score(test_client, db_connection, laure_loge_jwt):
    response = await test_client.post(
        "/v1/nps-rating",
        json={"score": 9001},  # Over-promoter.
        headers={"jwt-token": laure_loge_jwt},
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


async def test_nps_rating_double_submission(test_client, db_connection, laure_loge_jwt):
    row = await db_connection.fetchrow(
        """
        INSERT INTO nps_rating (account_id, score)
        VALUES ($1, $2)
        RETURNING id, created_at
        """,
        pro_uuid,
        10,
    )
    rating_id = row["id"]
    created_at = row["created_at"]
    response = await test_client.post(
        "/v1/nps-rating",
        json={"score": 0},
        headers={"jwt-token": laure_loge_jwt},
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
