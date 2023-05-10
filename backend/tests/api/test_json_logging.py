import logging

from httpx import AsyncClient
from pytest import LogCaptureFixture


async def test_json_logging_request(
    caplog: LogCaptureFixture, test_client: AsyncClient
):
    with caplog.at_level(logging.INFO):
        await test_client.get(
            "/",
        )
        assert "http" in caplog.text
        assert "network" in caplog.text
        assert "duration" in caplog.text
        assert "response" in caplog.text
