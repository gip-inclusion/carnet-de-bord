from pydantic import EmailStr, HttpUrl

from cdb.api.db.crud.structure import get_structure_by_name, insert_structure
from cdb.api.db.models.structure import Structure, StructureInsert


async def test_insert_structure(db_connection):

    structure_insert: StructureInsert = StructureInsert(
        siret="test siret",
        name="test name",
        short_desc="short desc",
        phone="0666666666",
        email=EmailStr("test@test.com"),
        postal_code="72000",
        city="Le Mans",
        address1="Rue des coquelicots",
        address2="addresse 2",
        website=HttpUrl(url="www.test.com", scheme="https"),
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


async def test_get_structure_by_name_case_insensitive(db_connection):

    structure: Structure | None = await get_structure_by_name(
        db_connection, "pole emploi agence livry-gargnan"
    )

    assert structure is not None


async def test_get_structure_does_not_validate_email_nor_website(db_connection):

    await db_connection.fetchrow(
        """
        INSERT INTO public.structure
            (siret, name, phone, email, postal_code, city, website, deployment_id)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
        """,
        *{
            "siret": "",
            "name": "test validate",
            "phone": "",
            "email": "",
            "postal_code": "",
            "city": "",
            "website": "",
            "deployment_id": None,
        }.values(),
    )

    structure: Structure | None = await get_structure_by_name(
        db_connection, "test validate"
    )

    assert structure is not None
