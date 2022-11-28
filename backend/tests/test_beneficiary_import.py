from datetime import date

from api.db.models.beneficiary import BeneficiaryImport


async def test_strip_beneficiary_data_on_import():
    beneficiary = BeneficiaryImport(
        internal_id=" 123 ",
        firstname="Remi",
        lastname="Cado",
        date_of_birth=date(2001, 4, 30),
        nir=" 101047505612317  ",
    )
    assert beneficiary.internal_id == "123"
    assert beneficiary.nir == "101047505612317"
