from datetime import datetime
from typing import List
from uuid import uuid4

import pytest

from cdb.api.db.models.focus import Focus
from cdb.api.db.models.target import Target
from cdb.api.domain.contraintes import (
    FocusToAdd,
    TargetPayload,
    TargetToAdd,
    diff_contraintes,
)
from cdb.pe.models.dossier_individu_api import Contrainte, Objectif


def test_diff_empty_contraintes_and_empty_focus():
    result = diff_contraintes([], [])

    assert result.focus_to_add == []
    assert result.focus_ids_to_delete == []
    assert result.target_differences.targets_to_add == []
    assert result.target_differences.target_ids_to_delete == []


def test_diff_empty_contraintes_and_existing_focus(notebook_focuses: List[Focus]):
    result = diff_contraintes(notebook_focuses, [])

    assert result.focus_to_add == []
    assert result.focus_ids_to_delete == [focus.id for focus in notebook_focuses]
    assert result.target_differences.targets_to_add == []
    assert result.target_differences.target_ids_to_delete == []


def test_diff_existing_contraintes_and_empty_focus(contraintes: List[Contrainte]):
    result = diff_contraintes([], contraintes)

    assert result.focus_to_add == [
        FocusToAdd(
            theme="mobilite",
            targets=[TargetPayload(target="Dépendant des transports en commun")],
        ),
        FocusToAdd(theme="difficulte_administrative"),
    ]
    assert result.focus_ids_to_delete == []
    assert result.target_differences.targets_to_add == []
    assert result.target_differences.target_ids_to_delete == []


def test_diff_existing_contraintes_and_existing_focus(
    notebook_focuses: List[Focus], contraintes: List[Contrainte]
):
    result = diff_contraintes(focuses=notebook_focuses, contraintes=contraintes)

    assert result.focus_to_add == [
        FocusToAdd(theme="difficulte_administrative"),
    ]
    assert result.focus_ids_to_delete == [
        focus.id for focus in notebook_focuses if focus.theme == "logement"
    ]
    focus_ids = [focus.id for focus in notebook_focuses if focus.theme == "mobilite"]
    assert result.target_differences.targets_to_add == [
        TargetToAdd(
            focus_id=focus_ids[0],
            target="Dépendant des transports en commun",
        )
    ]
    assert result.target_differences.target_ids_to_delete == []


def test_shared_contrainte_with_no_objectif_and_no_target(
    shared_focus_with_no_target: Focus, shared_contrainte_with_no_objectif: Contrainte
):
    result = diff_contraintes(
        [shared_focus_with_no_target], [shared_contrainte_with_no_objectif]
    )

    assert result.focus_to_add == []
    assert result.focus_ids_to_delete == []
    assert result.target_differences.targets_to_add == []
    assert result.target_differences.target_ids_to_delete == []


def test_shared_contrainte_with_objectif_and_no_target(
    shared_contrainte_with_objectifs: Contrainte,
    shared_focus_with_no_target: Focus,
):
    result = diff_contraintes(
        focuses=[shared_focus_with_no_target],
        contraintes=[shared_contrainte_with_objectifs],
    )

    assert result.focus_to_add == []
    assert result.focus_ids_to_delete == []
    assert result.target_differences.targets_to_add == [
        TargetToAdd(
            focus_id=shared_focus_with_no_target.id,
            target="Dépendant des transports en commun",
        )
    ]
    assert result.target_differences.target_ids_to_delete == []


def test_shared_contrainte_with_no_objectif_and_target(
    shared_contrainte_with_no_objectif: Contrainte,
    shared_focus_with_targets: Focus,
):
    result = diff_contraintes(
        focuses=[shared_focus_with_targets],
        contraintes=[shared_contrainte_with_no_objectif],
    )

    assert result.focus_to_add == []
    assert result.focus_ids_to_delete == []
    assert result.target_differences.targets_to_add == []
    assert result.target_differences.target_ids_to_delete == [
        target.id for target in (shared_focus_with_targets.targets or [])
    ]


def test_shared_contraintes_with_objectifs_and_targets(
    shared_contrainte_with_objectifs: Contrainte,
    shared_focus_with_targets: Focus,
):
    result = diff_contraintes(
        focuses=[shared_focus_with_targets],
        contraintes=[shared_contrainte_with_objectifs],
    )

    [target_id_to_delete] = [
        target.id
        for target in (shared_focus_with_targets.targets or [])
        if target.target == "Permis non valide / suspension de permis"
    ]
    assert result.focus_to_add == []
    assert result.focus_ids_to_delete == []
    assert result.target_differences.targets_to_add == [
        TargetToAdd(
            focus_id=shared_focus_with_targets.id,
            target="Dépendant des transports en commun",
        )
    ]
    assert result.target_differences.target_ids_to_delete == [target_id_to_delete]


@pytest.fixture(scope="session")
def notebook_target() -> List[Target]:
    return [
        Target(
            id=uuid4(),
            focus_id=uuid4(),
            target="Target 1",
            creator_id=uuid4(),
            created_at=datetime.now(),
            updated_at=datetime.now(),
            status="",
        )
    ]


@pytest.fixture(scope="session")
def notebook_focuses() -> List[Focus]:
    return [
        Focus(
            id=uuid4(),
            creator_id=None,
            linked_to=None,
            targets=None,
            theme="mobilite",
            notebook_id=uuid4(),
            created_at=datetime.now(),
            updated_at=datetime.now(),
        ),
        Focus(
            id=uuid4(),
            creator_id=None,
            linked_to=None,
            targets=None,
            theme="logement",
            notebook_id=uuid4(),
            created_at=datetime.now(),
            updated_at=datetime.now(),
        ),
    ]


@pytest.fixture(scope="session")
def contraintes() -> List[Contrainte]:
    return [
        Contrainte(
            code="23",
            date=None,
            valeur="OUI",
            libelle="Développer sa mobilité",
            situations=[],
            objectifs=[
                Objectif(
                    code="6",
                    libelle="Aucun moyen de transport à disposition",
                    valeur="NON_ABORDEE",
                ),
                Objectif(
                    code="7", libelle="Dépendant des transports en commun", valeur="OUI"
                ),
            ],
        ),
        Contrainte(
            code="27",
            libelle="Faire face à des difficultés de logement",
            valeur="NON_ABORDEE",
            date=None,
            situations=[],
            objectifs=[],
        ),
        Contrainte(
            code="29",
            libelle="Faire face à des difficultés administratives ou juridiques",
            valeur="OUI",
            date=None,
            situations=[],
            objectifs=[],
        ),
    ]


@pytest.fixture(scope="session")
def shared_focus_with_no_target() -> Focus:
    return Focus(
        id=uuid4(),
        creator_id=None,
        linked_to=None,
        targets=None,
        theme="mobilite",
        notebook_id=uuid4(),
        created_at=datetime.now(),
        updated_at=datetime.now(),
    )


@pytest.fixture(scope="session")
def shared_contrainte_with_no_objectif() -> Contrainte:
    return Contrainte(
        code="23",
        date=None,
        valeur="OUI",
        libelle="Développer sa mobilité",
        situations=[],
        objectifs=[],
    )


@pytest.fixture(scope="session")
def shared_focus_with_targets() -> Focus:
    focus_id = uuid4()
    return Focus(
        id=focus_id,
        creator_id=None,
        linked_to=None,
        theme="mobilite",
        notebook_id=uuid4(),
        created_at=datetime.now(),
        updated_at=datetime.now(),
        targets=[
            Target(
                id=uuid4(),
                focus_id=focus_id,
                target="Dépendant des transports en commun",
                creator_id=None,
                created_at=datetime.now(),
                updated_at=datetime.now(),
                status="in_progress",
            ),
            Target(
                id=uuid4(),
                focus_id=focus_id,
                target="Permis non valide / suspension de permis",
                creator_id=None,
                created_at=datetime.now(),
                updated_at=datetime.now(),
                status="in_progress",
            ),
        ],
    )


@pytest.fixture(scope="session")
def shared_contrainte_with_objectifs() -> Contrainte:
    return Contrainte(
        code="23",
        date=None,
        valeur="OUI",
        libelle="Développer sa mobilité",
        situations=[],
        objectifs=[
            Objectif(
                code="6",
                libelle="Aucun moyen de transport à disposition",
                valeur="NON_ABORDEE",
            ),
            Objectif(
                code="7", libelle="Dépendant des transports en commun", valeur="OUI"
            ),
        ],
    )
