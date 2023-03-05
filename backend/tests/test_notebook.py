from datetime import date
from uuid import UUID

from cdb.api.db.crud.notebook import (
    find_focus,
    find_target_from_focus,
    get_notebook_by_id,
)
from cdb.api.db.models.beneficiary import Beneficiary
from cdb.api.db.models.focus import Focus
from cdb.api.db.models.notebook import Notebook
from cdb.api.db.models.target import Target


async def test_get_notebook_by_id(db_connection):

    # Notebook of 'keller.noel@fugiat.fr', 'Noel', 'Keller'
    notebook: Notebook | None = await get_notebook_by_id(
        db_connection, UUID("a89cf5f3-7013-480a-a3bf-e10ad0b6f9e8")
    )

    assert notebook is not None

    assert notebook.right_rqth
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
    assert not notebook.right_rqth
    assert notebook.education_level is None


async def test_get_notebook_focuses(beneficiary_sophie_tifour: Beneficiary):

    notebook: Notebook | None = beneficiary_sophie_tifour.notebook

    assert notebook is not None

    assert notebook.focuses is not None
    assert len(notebook.focuses) == 3

    focus: Focus | None = await find_focus(notebook, lambda f: f.theme == "emploi")

    assert focus is not None
    assert focus.targets is not None

    assert len(focus.targets) == 3

    target: Target | None = await find_target_from_focus(
        focus, lambda t: t.target == "Accéder à l’emploi"
    )

    assert target is not None

    assert target.actions is not None

    assert len(target.actions) == 3
