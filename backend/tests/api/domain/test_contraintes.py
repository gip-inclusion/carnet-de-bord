from datetime import datetime
from typing import List
from uuid import uuid4

import pytest

from cdb.api.db.models.focus import Focus
from cdb.api.domain.contraintes import (
    FocusToAdd,
    diff_contraintes,
)
from cdb.pe.models.dossier_individu_api import Contrainte


def test_diff_empty_contraintes_and_empty_focus():
    result = diff_contraintes([], [])

    assert result.focus_to_add == []
    assert result.focus_to_delete == []


def test_diff_empty_contraintes_and_existing_focus(notebook_focuses: List[Focus]):
    result = diff_contraintes(notebook_focuses, [])

    assert result.focus_to_add == []
    assert result.focus_to_delete == [focus.id for focus in notebook_focuses]


def test_diff_existing_contraintes_and_empty_focus(contraintes: List[Contrainte]):
    result = diff_contraintes([], contraintes)

    assert result.focus_to_add == [
        FocusToAdd(theme="mobilite"),
        FocusToAdd(theme="difficulte_administrative"),
    ]
    assert result.focus_to_delete == []


def test_diff_existing_contraintes_and_existing_focus(
    notebook_focuses: List[Focus], contraintes: List[Contrainte]
):
    result = diff_contraintes(notebook_focuses, contraintes)

    assert result.focus_to_add == [
        FocusToAdd(theme="difficulte_administrative"),
    ]
    assert result.focus_to_delete == [
        focus.id for focus in notebook_focuses if focus.theme == "logement"
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
            objectifs=[],
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
