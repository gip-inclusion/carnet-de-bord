async def test_exception_should_return_detail_and_message(
    test_client,
):
    response = await test_client.post(
        "/v1/nps-rating",
        json={"score": 10},
    )
    assert response.status_code == 401
    json = response.json()
    assert json["detail"] == "Missing credentials"
    assert json["message"] == "Missing credentials"
