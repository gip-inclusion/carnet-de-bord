from uuid import UUID

from api.db.crud.notebook import get_notebook_by_id
from api.db.models.notebook import Notebook

# @TODO: add tests for
# right_rsa: str | None = Field(None, title="Droits RSA")
# right_rqth: bool = Field(False, title="Droits RQTH")
# right_are: bool = Field(False, title="Droits RSA")
# right_ass: bool | None = Field(False, title="Droits ASS")
# right_bonus: bool = Field(False, title="Droits Bonus")
#


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

    notebook: Notebook | None = await get_notebook_by_id(
        db_connection, UUID("d235c967-29dc-47bc-b2f3-43aa46c9f54f")
    )

    assert notebook is not None
    assert notebook.right_rsa is None
    assert not notebook.right_rqth
    assert notebook.right_are
    assert not notebook.right_ass
    assert notebook.right_bonus
