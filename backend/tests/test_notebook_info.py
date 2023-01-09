from backend.api.db.crud.notebook_info import insert_or_update_need_orientation
from backend.api.db.models.beneficiary import Beneficiary
from backend.api.db.models.notebook_info import NotebookInfo, OrientationType


async def test_insert_notebook_info(
    db_connection, beneficiary_sophie_tifour: Beneficiary
):
    notebok_info: NotebookInfo | None = await insert_or_update_need_orientation(
        db_connection, beneficiary_sophie_tifour.notebook.id, OrientationType.pro, True
    )
    assert notebok_info is not None
    assert notebok_info.need_orientation
    assert notebok_info.notebook_id == beneficiary_sophie_tifour.notebook.id
    assert notebok_info.orientation == OrientationType.pro


async def test_insert_update_need_orientation(
    db_connection, beneficiary_sophie_tifour: Beneficiary
):

    await insert_or_update_need_orientation(
        db_connection, beneficiary_sophie_tifour.notebook.id, OrientationType.pro, True
    )
    notebok_info: NotebookInfo | None = await insert_or_update_need_orientation(
        db_connection, beneficiary_sophie_tifour.notebook.id, OrientationType.pro, False
    )
    assert notebok_info is not None
    assert notebok_info.need_orientation is False
    assert notebok_info.notebook_id == beneficiary_sophie_tifour.notebook.id
    assert notebok_info.orientation == OrientationType.pro
