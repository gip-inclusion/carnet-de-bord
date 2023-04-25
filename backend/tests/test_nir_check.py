from cdb.api.db.models.nir import nir_format


async def test_nir_length():
    assert (
        nir_format("12345678901234")
        == "The NIR must be 13 or 15 (with control key) digits long"
    )
    assert (
        nir_format("1234567890123456")
        == "The NIR must be 13 or 15 (with control key) digits long"
    )
    assert nir_format("185077505612323") is None


async def test_nir_only_digits():
    assert nir_format("123456a78901234") == "The NIR cannot contain letters"
    assert nir_format("-12345678901234") == "The NIR cannot contain letters"


async def test_nir_wrong_key():
    assert nir_format("185077505612324") == "The provided NIR is not valid"


async def test_nir_corse():
    assert nir_format("192102A131123") is None
    assert nir_format("192102B131123") is None

    assert nir_format("192102A13112318") == "The provided NIR is not valid"

    assert nir_format("192102A13112357") is None
