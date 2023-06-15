from datetime import date

from cdb.api.db.models.beneficiary import BeneficiaryImport


async def test_strip_beneficiary_data_on_import():
    beneficiary = BeneficiaryImport(
        external_id=" 123 ",
        firstname="Remi",
        lastname="Cado",
        date_of_birth=date(2001, 4, 30),
        nir=" 101047505612317  ",
    )
    assert beneficiary.external_id == "123"
    assert beneficiary.nir == "1010475056123"
