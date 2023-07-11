from typing import List

import pytest

from cdb.api.db.models.focus import Focus
from cdb.api.domain.contraintes import diff_contraintes
from cdb.pe.models.dossier_individu_api import Contrainte


def test_diff_contraintes(
    empty_notebook_focuses: List[Focus], empty_contraintes: List[Contrainte]
):
    result = diff_contraintes(empty_notebook_focuses, empty_contraintes)

    assert result.focus_to_add == []
    assert result.focus_to_delete == []


@pytest.fixture(scope="session")
def empty_notebook_focuses() -> List[Focus]:
    return []


@pytest.fixture(scope="session")
def empty_contraintes() -> List[Contrainte]:
    return []
