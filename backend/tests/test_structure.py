from api.db.crud.structure import get_structure_by_name, insert_structure
from api.db.models.structure import Structure, StructureInsert


async def test_insert_structure(db_connection):

    structure_insert: StructureInsert = StructureInsert(
        siret="test siret",
        name="test name",
        short_desc="short desc",
        phone="0666666666",
        email="test@test.com",
        postal_code="72000",
        city="Le Mans",
        address1="Rue des coquelicots",
        address2="addresse 2",
        website="https://test.com",
        deployment_id=None,
    )
    structure: Structure | None = await insert_structure(
        db_connection, structure_insert=structure_insert
    )

    assert structure is not None


async def test_get_structure_by_name(db_connection):

    structure: Structure | None = await get_structure_by_name(
        db_connection, "Pole Emploi Agence Livry-Gargnan"
    )

    assert structure is not None
