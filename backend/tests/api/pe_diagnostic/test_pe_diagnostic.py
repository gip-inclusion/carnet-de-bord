import uuid
from datetime import datetime, timedelta, timezone
from typing import Any, List
from unittest.mock import AsyncMock
from uuid import UUID

import pytest
from faker import Faker

from cdb.api.core.settings import Settings, settings
from cdb.api.db.models.ref_situation import NotebookSituation, RefSituation
from cdb.api.domain.contraintes import FocusDifferences, TargetDifferences
from cdb.api.domain.situations import SituationDifferences
from cdb.api.v1.routers.pe_diagnostic.pe_diagnostic import (
    Notebook as NotebookLocal,
)
from cdb.api.v1.routers.pe_diagnostic.pe_diagnostic import (
    update_notebook_from_pole_emploi,
)
from cdb.api.v1.routers.pe_diagnostic.pe_diagnostic_models import Focus, Target
from cdb.pe.models.dossier_individu_api import (
    Contrainte,
    ContraintesIndividu,
    ContrainteValeurEnum,
    DossierIndividuData,
    Objectif,
    ObjectifValeurEnum,
    Situation,
    SituationValeurEnum,
)

# -----------------------------------------------------------
# Utils
# -----------------------------------------------------------

fake = Faker()

pytestmark = pytest.mark.graphql

a_ref_situation = RefSituation(
    id=uuid.uuid4(), description="Description", theme="Theme"
)


class FakeNotebookSituation(NotebookSituation):
    def __init__(
        self,
        id=uuid.uuid4(),
        ref_situation_id=a_ref_situation.id,
        created_at=fake.date_time(),
        deleted_at=None,
    ):
        super().__init__(
            id=id,
            situationId=ref_situation_id,
            createdAt=created_at,
            deleteAt=deleted_at,
        )


class FakeNotebookTarget(Target):
    def __init__(
        self,
        id: UUID = uuid.uuid4(),
        target: str = "target",
    ):
        super().__init__(id=id, target=target)


class FakeNotebookFocus(Focus):
    def __init__(
        self,
        id: UUID = uuid.uuid4(),
        created_at: str = str(fake.date_time(tzinfo=timezone.utc)),
        theme="logement",
        targets: List[Target] | None = None,
    ):
        super().__init__(
            id=id,
            created_at=created_at,
            theme=theme,
            targets=targets if targets is not None else [FakeNotebookTarget()],
        )


class FakeNotebook(NotebookLocal):
    def __init__(
        self,
        diagnostic_fetched_at: str | None = str(fake.date_time(tzinfo=timezone.utc)),
        beneficiary_id: UUID = uuid.uuid4(),
        nir: str | None = fake.ean(),
        date_of_birth: str = str(fake.date_time(tzinfo=timezone.utc)),
        last_diagnostic_hash: str | None = fake.word(),
        situations: List[NotebookSituation] | None = None,
        focuses: List[Focus] | None = None,
    ):
        super().__init__(
            diagnostic_fetched_at=diagnostic_fetched_at,
            beneficiary_id=beneficiary_id,
            nir=nir,
            date_of_birth=date_of_birth,
            last_diagnostic_hash=last_diagnostic_hash,
            situations=situations
            if situations is not None
            else [FakeNotebookSituation()],
            focuses=focuses if focuses is not None else [FakeNotebookFocus()],
        )


class FakeSituation(Situation):
    def __init__(
        self,
        code: str = fake.pystr_format("##"),
        libelle: str = fake.sentence(),
        valeur: str = fake.enum(SituationValeurEnum),
    ):
        super().__init__(
            code=code,
            libelle=libelle,
            valeur=valeur,
        )


class FakeObjectif(Objectif):
    def __init__(
        self,
        code=fake.pystr_format("##"),
        libelle=fake.sentence(),
        valeur=fake.enum(ObjectifValeurEnum),
    ):
        super().__init__(
            code=code,
            libelle=libelle,
            valeur=valeur,
        )


class FakeContrainte(Contrainte):
    def __init__(
        self,
        code: str = fake.pystr_format("##"),
        libelle: str = fake.sentence(),
        valeur: str = fake.enum(ContrainteValeurEnum),
        date: datetime = fake.date(),
        objectifs: List[Objectif] | None = None,
        situations: List[Situation] | None = None,
    ):
        super().__init__(
            code=code,
            libelle=libelle,
            valeur=valeur,
            date=date,
            situations=situations or [],
            objectifs=objectifs or [],
        )


class FakeContraintesIndividu(ContraintesIndividu):
    def __init__(
        self,
        conseiller=fake.first_name(),
        dateDeModification=fake.date(),
        code=fake.ean(),
        libelle=fake.sentence(),
        contraintes=None,
    ):
        super().__init__(
            conseiller=conseiller,
            dateDeModification=dateDeModification,
            code=code,
            libelle=libelle,
            contraintes=contraintes or [],
        )


class FakeDossierIndividu(DossierIndividuData):
    def __init__(
        self,
        besoins_par_diagnostic_individu_dtos=None,
        contraintes_individus_dto=None,
    ):
        super().__init__(
            besoinsParDiagnosticIndividuDtos=besoins_par_diagnostic_individu_dtos or [],
            contraintesIndividusDto=contraintes_individus_dto
            or FakeContraintesIndividu(),
        )


def async_mock(return_value: Any):
    mock = AsyncMock()
    mock.return_value = return_value
    return mock


class FakeIO:
    def __init__(
        self,
        find_notebook=None,
        get_dossier_pe=None,
        update_diagnostic_fetch_date=None,
        save_in_external_data=None,
        get_ref_situations=async_mock(return_value=[a_ref_situation]),
        save_differences=None,
    ):
        self.save_differences = save_differences or AsyncMock()
        self.get_ref_situations = get_ref_situations
        self.save_in_external_data = save_in_external_data or AsyncMock()
        self.update_diagnostic_fetch_date = update_diagnostic_fetch_date or AsyncMock()
        self.get_dossier_pe = get_dossier_pe or async_mock(
            return_value=FakeDossierIndividu()
        )
        self.find_notebook = find_notebook or async_mock(return_value=FakeNotebook())


@pytest.fixture(autouse=True)
async def pe_settings():
    settings.ENABLE_PE_DIAGNOSTIC_API = True
    settings.ENABLE_SYNC_CONTRAINTES = True
    yield settings
    settings.ENABLE_PE_DIAGNOSTIC_API = True
    settings.ENABLE_SYNC_CONTRAINTES = True


# -----------------------------------------------------------
# Unit tests
# -----------------------------------------------------------


async def test_does_nothing_when_pe_has_no_info_for_our_beneficiary():
    io = FakeIO(get_dossier_pe=async_mock(return_value=None))

    response = await update_notebook_from_pole_emploi(io, uuid.uuid4())

    assert response == {
        "data_has_been_updated": False,
        "external_data_has_been_updated": False,
        "has_pe_diagnostic": True,
    }


async def test_does_nothing_when_our_pe_data_was_fetched_recently():
    io = FakeIO(
        find_notebook=async_mock(
            return_value=FakeNotebook(diagnostic_fetched_at=str(fresh_creation_date()))
        )
    )

    response = await update_notebook_from_pole_emploi(io, uuid.uuid4())

    assert not io.get_dossier_pe.called
    assert response == {
        "data_has_been_updated": False,
        "external_data_has_been_updated": False,
        "has_pe_diagnostic": True,
    }


async def test_does_nothing_when_we_do_not_find_requested_notebook():
    io = FakeIO(find_notebook=async_mock(return_value=None))

    response = await update_notebook_from_pole_emploi(io, uuid.uuid4())

    assert response == {"errors": [{"message": "the notebook was not found"}]}


async def test_return_an_error_when_the_beneficiary_has_no_nir():
    io = FakeIO(find_notebook=async_mock(return_value=FakeNotebook(nir=None)))

    response = await update_notebook_from_pole_emploi(io, uuid.uuid4())

    assert response == {
        "errors": [
            {"message": "the notebook has no nir, it cannot be synced with pole emploi"}
        ]
    }


async def test_refreshes_data_from_pe_when_they_have_expired():
    io = FakeIO(
        find_notebook=async_mock(
            return_value=FakeNotebook(diagnostic_fetched_at=str(expired_date()))
        )
    )

    response = await update_notebook_from_pole_emploi(io, uuid.uuid4())

    assert response == {
        "data_has_been_updated": True,
        "external_data_has_been_updated": True,
        "has_pe_diagnostic": True,
    }


async def test_does_nothing_when_the_diagnostic_was_called_recently():
    io = FakeIO(
        find_notebook=async_mock(
            return_value=FakeNotebook(diagnostic_fetched_at=str(fresh_creation_date()))
        )
    )

    response = await update_notebook_from_pole_emploi(io, uuid.uuid4())

    assert not io.get_dossier_pe.called
    assert response == {
        "data_has_been_updated": False,
        "external_data_has_been_updated": False,
        "has_pe_diagnostic": True,
    }


async def test_does_nothing_when_feature_is_disabled(pe_settings: Settings):
    pe_settings.ENABLE_PE_DIAGNOSTIC_API = False
    io = FakeIO()

    response = await update_notebook_from_pole_emploi(io, uuid.uuid4())

    assert not io.get_dossier_pe.called
    assert response == {
        "errors": [{"message": "The pole-emploi.io diagnostic api feature is disabled"}]
    }
    pe_settings.ENABLE_PE_DIAGNOSTIC_API = True


async def test_saves_the_new_pe_diagnostic_into_external_data():
    dossier = FakeDossierIndividu()
    io = FakeIO(get_dossier_pe=async_mock(return_value=dossier))

    response = await update_notebook_from_pole_emploi(io, uuid.uuid4())

    assert io.save_in_external_data.call_args[0][0] == dossier
    assert response == {
        "data_has_been_updated": True,
        "external_data_has_been_updated": True,
        "has_pe_diagnostic": True,
    }


async def test_does_not_store_anything_if_pe_data_has_not_changed_since_last_fetch():
    dossier = FakeDossierIndividu()
    io = FakeIO(
        find_notebook=async_mock(
            return_value=FakeNotebook(
                diagnostic_fetched_at=str(expired_date()),
                last_diagnostic_hash=dossier.hash(),
            )
        ),
        get_dossier_pe=async_mock(return_value=dossier),
    )

    response = await update_notebook_from_pole_emploi(io, uuid.uuid4())

    assert not io.save_in_external_data.called
    assert response == {
        "data_has_been_updated": False,
        "external_data_has_been_updated": False,
        "has_pe_diagnostic": True,
    }


async def test_does_nothing_when_data_from_pe_is_new_but_matches_our_situations():
    """
    Test with empty situations because it's easier,
    the real compare method is tested elsewhere
    """

    dossier = FakeDossierIndividu(
        contraintes_individus_dto=FakeContraintesIndividu(contraintes=[]),
        besoins_par_diagnostic_individu_dtos=[],
    )
    io = FakeIO(
        find_notebook=async_mock(return_value=FakeNotebook(situations=[], focuses=[])),
        get_dossier_pe=async_mock(return_value=dossier),
    )

    response = await update_notebook_from_pole_emploi(io, uuid.uuid4())

    assert response == {
        "data_has_been_updated": False,
        "external_data_has_been_updated": True,
        "has_pe_diagnostic": True,
    }


async def test_update_situation_when_received_situation_are_an_empty_array():
    dossier = FakeDossierIndividu(
        contraintes_individus_dto=FakeContraintesIndividu(contraintes=[]),
        besoins_par_diagnostic_individu_dtos=[],
    )
    to_delete = FakeNotebookSituation()
    notebook = FakeNotebook(situations=[to_delete], focuses=[])
    io = FakeIO(
        get_dossier_pe=async_mock(return_value=dossier),
        find_notebook=async_mock(return_value=notebook),
    )

    notebook_id = uuid.uuid4()
    response = await update_notebook_from_pole_emploi(io, notebook_id)

    io.save_differences.assert_called_with(
        SituationDifferences(
            [],
            [to_delete.id],
        ),
        FocusDifferences(
            focuses_to_add=[],
            focus_ids_to_delete=[],
            target_differences=TargetDifferences(
                targets_to_add=[], target_ids_to_cancel=[], target_ids_to_end=[]
            ),
        ),
        notebook_id,
    )
    assert response == {
        "data_has_been_updated": True,
        "external_data_has_been_updated": True,
        "has_pe_diagnostic": True,
    }


async def test_does_not_update_cdb_when_sync_flag_is_false(
    pe_settings: Settings,
):
    pe_settings.ENABLE_SYNC_CONTRAINTES = False
    io = FakeIO()

    response = await update_notebook_from_pole_emploi(io, uuid.uuid4())

    io.save_differences.assert_not_called()
    assert response == {
        "data_has_been_updated": False,
        "external_data_has_been_updated": True,
        "has_pe_diagnostic": True,
    }


def fresh_creation_date():
    return expired_date() + timedelta(minutes=1)


def expired_date():
    return datetime.now(tz=timezone.utc) - timedelta(hours=1)
