from datetime import date
from uuid import UUID

from api.db.crud.notebook import get_notebook_by_id
from api.db.models.notebook import Notebook


async def test_get_notebook_by_id(db_connection):

    notebook: Notebook | None = await get_notebook_by_id(
        db_connection, UUID("a89cf5f3-7013-480a-a3bf-e10ad0b6f9e8")
    )

    assert notebook is not None
    assert notebook.right_rsa == "rsa_droit_ouvert_et_suspendu"
    assert notebook.right_rqth
    assert notebook.right_are
    assert notebook.right_ass
    assert notebook.right_bonus
    assert notebook.geographical_area == "between_10_20"
    assert notebook.education_level == "NV4"
    assert notebook.work_situation_date == date(2022, 7, 22)
    assert notebook.contract_type == "cer"
    assert notebook.contract_sign_date == date(2021, 1, 5)
    assert notebook.work_situation == "iae"
    assert notebook.work_situation_end_date == date(2022, 1, 5)
    assert notebook.contract_start_date == date(2022, 3, 5)
    assert notebook.contract_end_date == date(2022, 5, 5)

    notebook: Notebook | None = await get_notebook_by_id(
        db_connection, UUID("d235c967-29dc-47bc-b2f3-43aa46c9f54f")
    )

    assert notebook is not None
    assert notebook.right_rsa is None
    assert not notebook.right_rqth
    assert notebook.right_are
    assert not notebook.right_ass
    assert notebook.right_bonus
    assert notebook.geographical_area is None
    assert notebook.education_level is None
