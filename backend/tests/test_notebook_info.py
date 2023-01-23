from uuid import UUID

from cdb.api.db.crud.notebook_info import insert_or_update_need_orientation
from cdb.api.db.models.beneficiary import Beneficiary
from cdb.api.db.models.notebook_info import NotebookInfo


async def test_insert_notebook_info(
    db_connection,
    beneficiary_sophie_tifour: Beneficiary,
    orientation_system_pro_id: UUID,
):
    notebok_info: NotebookInfo | None = await insert_or_update_need_orientation(
        db_connection,
        beneficiary_sophie_tifour.notebook.id,
        orientation_system_pro_id,
        True,
    )
    assert notebok_info is not None
    assert notebok_info.need_orientation
    assert notebok_info.notebook_id == beneficiary_sophie_tifour.notebook.id
    assert notebok_info.orientation_system_id == orientation_system_pro_id


async def test_insert_update_need_orientation(
    db_connection,
    beneficiary_sophie_tifour: Beneficiary,
    orientation_system_pro_id: UUID,
):

    # Orientation system "Pro"
    await insert_or_update_need_orientation(
        db_connection,
        beneficiary_sophie_tifour.notebook.id,
        orientation_system_pro_id,
        True,
    )
    notebok_info: NotebookInfo | None = await insert_or_update_need_orientation(
        db_connection,
        beneficiary_sophie_tifour.notebook.id,
        orientation_system_pro_id,
        False,
    )
    assert notebok_info is not None
    assert notebok_info.need_orientation is False
    assert notebok_info.notebook_id == beneficiary_sophie_tifour.notebook.id
    assert notebok_info.orientation_system_id == orientation_system_pro_id
