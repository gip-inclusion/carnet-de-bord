from asyncpg import Record
from asyncpg.connection import Connection


async def test_fusion(connection: Connection):
    record = await connection.fetchrow(
        """
            SELECT * FROM public.notebook_focus WHERE notebook_focus.id ='f8b75201-97ec-4248-9dad-6f2bfb049b49'
        """
    )
    assert len(record["situations"]) is 2
    assert "Prêt pour une formation avec un accompagnement " in record(["situations"])

    recordRefSituation = await connection.fetchrow(
        """
            SELECT count(*) FROM public.ref_situation WHERE description='Prêt à en parler'
        """
    )
    assert len(recordRefSituation) is 0
    recordRefSituation = await connection.fetchrow(
        """
            SELECT count(*) FROM public.ref_situation WHERE description='Prêt pour une formation avec un accompagnement'
        """
    )
    assert len(recordRefSituation) is 1


async def test_modifier(connection: Connection):
    record = await connection.fetchrow(
        """
            SELECT * FROM public.notebook_focus WHERE notebook_focus.id ='f8b75201-97ec-4248-9dad-6f2bfb049b49'
        """
    )

    assert len(record["situations"]) is 2
    assert "Prêt à suivre une formation" in record(["situations"])

    recordRefSituation = await connection.fetchrow(
        """
            SELECT count(*) FROM public.ref_situation WHERE description='Prêt pour une formation'
        """
    )

    assert len(recordRefSituation) is 0
    recordRefSituation = await connection.fetchrow(
        "SELECT count(*) FROM public.ref_situation WHERE description='Prêt à suivre une formation'"
    )

    assert len(recordRefSituation) is 1


async def test_add(connection: Connection):
    record = await connection.fetchrow(
        """
            SELECT * FROM public.ref_action WHERE description ='Travailler le CV'
        """
    )
    assert len(record) is 1
