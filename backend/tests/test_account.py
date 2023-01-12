from cdb.api.db.crud.account import create_username


async def test_create_username():
    assert create_username("lionel", []) == "lionel"

    assert create_username("lionel", ["lionel"]) == "lionel1"
    assert create_username("lionel", ["lionel", "lionel1"]) == "lionel2"

    assert create_username("lionel", ["lionel", "lionelb"]) == "lionel1"
    assert (
        create_username("lionel", ["lionela", "lionel2b", "lionelb", "lionel10"])
        == "lionel11"
    )
