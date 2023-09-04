from datetime import timezone
from typing import List
from uuid import uuid4

import pytest
from faker import Faker

from cdb.api.db.crud.account import POLE_EMPLOI_SERVICE_ACCOUNT_ID
from cdb.api.domain.contraintes import (
    FocusToAdd,
    TargetPayload,
    TargetToAdd,
    diff_contraintes,
)
from cdb.api.v1.routers.pe_diagnostic.pe_diagnostic_models import Focus, Target
from cdb.pe.models.dossier_individu_api import Contrainte, Objectif

fake = Faker()


def test_diff_empty_contraintes_and_empty_focus():
    result = diff_contraintes([], [])

    assert result.focuses_to_add == []
    assert result.focuses_to_delete == []
    assert result.target_differences.targets_to_add == []
    assert result.target_differences.target_ids_to_cancel == []
    assert result.target_differences.target_ids_to_end == []


def test_diff_empty_contraintes_and_existing_focus(notebook_focuses: List[Focus]):
    result = diff_contraintes(notebook_focuses, [])

    assert result.focuses_to_add == []
    assert result.focuses_to_delete == notebook_focuses
    assert result.target_differences.targets_to_add == []
    assert result.target_differences.target_ids_to_cancel == []
    assert result.target_differences.target_ids_to_end == []


def test_diff_existing_contraintes_and_empty_focus(contraintes: List[Contrainte]):
    result = diff_contraintes([], contraintes)

    assert result.focuses_to_add == [
        FocusToAdd(
            theme="mobilite",
            creator_id=POLE_EMPLOI_SERVICE_ACCOUNT_ID,
            targets=[
                TargetPayload(target="Faire un point complet sur sa mobilité"),
                TargetPayload(target="Accéder à un véhicule"),
            ],
        ),
        FocusToAdd(
            theme="difficulte_administrative", creator_id=POLE_EMPLOI_SERVICE_ACCOUNT_ID
        ),
    ]
    assert result.focuses_to_delete == []
    assert result.target_differences.targets_to_add == []
    assert result.target_differences.target_ids_to_cancel == []
    assert result.target_differences.target_ids_to_end == []


def test_diff_existing_contraintes_and_existing_focus(
    notebook_focuses: List[Focus], contraintes: List[Contrainte]
):
    result = diff_contraintes(focuses=notebook_focuses, contraintes=contraintes)

    assert result.focuses_to_add == [
        FocusToAdd(
            theme="difficulte_administrative", creator_id=POLE_EMPLOI_SERVICE_ACCOUNT_ID
        ),
    ]
    assert result.focuses_to_delete == [
        focus for focus in notebook_focuses if focus.theme == "logement"
    ]
    [focus_id] = [focus.id for focus in notebook_focuses if focus.theme == "mobilite"]
    assert result.target_differences.targets_to_add == [
        TargetToAdd(
            target="Faire un point complet sur sa mobilité",
            focusId=focus_id,
            creatorId=POLE_EMPLOI_SERVICE_ACCOUNT_ID,
        ),
        TargetToAdd(
            target="Accéder à un véhicule",
            focusId=focus_id,
            creatorId=POLE_EMPLOI_SERVICE_ACCOUNT_ID,
        ),
    ]
    assert result.target_differences.target_ids_to_cancel == []
    assert result.target_differences.target_ids_to_end == []


def test_shared_contrainte_with_no_objectif_and_no_target(
    shared_focus_with_no_target: Focus, shared_contrainte_with_no_objectif: Contrainte
):
    result = diff_contraintes(
        [shared_focus_with_no_target], [shared_contrainte_with_no_objectif]
    )

    assert result.focuses_to_add == []
    assert result.focuses_to_delete == []
    assert result.target_differences.targets_to_add == []
    assert result.target_differences.target_ids_to_cancel == []
    assert result.target_differences.target_ids_to_end == []


def test_shared_contrainte_with_objectif_and_no_target(
    shared_contrainte_with_objectifs: Contrainte,
    shared_focus_with_no_target: Focus,
):
    result = diff_contraintes(
        focuses=[shared_focus_with_no_target],
        contraintes=[shared_contrainte_with_objectifs],
    )

    assert result.focuses_to_add == []
    assert result.focuses_to_delete == []
    assert result.target_differences.targets_to_add == [
        TargetToAdd(
            focusId=shared_focus_with_no_target.id,
            target="Faire un point complet sur sa mobilité",
            creatorId=POLE_EMPLOI_SERVICE_ACCOUNT_ID,
        ),
        TargetToAdd(
            focusId=shared_focus_with_no_target.id,
            target="Accéder à un véhicule",
            creatorId=POLE_EMPLOI_SERVICE_ACCOUNT_ID,
        ),
    ]
    assert result.target_differences.target_ids_to_cancel == []
    assert result.target_differences.target_ids_to_end == []


def test_shared_contrainte_with_no_objectif_and_target(
    shared_contrainte_with_no_objectif: Contrainte,
    shared_focus_with_targets: Focus,
):
    result = diff_contraintes(
        focuses=[shared_focus_with_targets],
        contraintes=[shared_contrainte_with_no_objectif],
    )

    assert result.focuses_to_add == []
    assert result.focuses_to_delete == []
    assert result.target_differences.targets_to_add == []
    assert result.target_differences.target_ids_to_end == [
        target.id
        for target in shared_focus_with_targets.targets
        if target.target == "Faire un point complet sur sa mobilité"
    ]
    assert result.target_differences.target_ids_to_cancel == [
        target.id
        for target in shared_focus_with_targets.targets
        if target.target == "Entretenir ou réparer son véhicule"
    ]


def test_shared_contraintes_with_objectifs_and_targets(
    shared_contrainte_with_objectifs: Contrainte,
    shared_focus_with_targets: Focus,
):
    result = diff_contraintes(
        focuses=[shared_focus_with_targets],
        contraintes=[shared_contrainte_with_objectifs],
    )

    target_ids_to_cancel = [
        target.id
        for target in (shared_focus_with_targets.targets or [])
        if target.target in ["Travailler la mobilité psychologique"]
    ]

    assert result.focuses_to_add == []
    assert result.focuses_to_delete == []
    assert result.target_differences.targets_to_add == [
        TargetToAdd(
            focusId=shared_focus_with_targets.id,
            target="Accéder à un véhicule",
            creatorId=POLE_EMPLOI_SERVICE_ACCOUNT_ID,
        )
    ]
    assert result.target_differences.target_ids_to_cancel == target_ids_to_cancel


@pytest.fixture(scope="session")
def notebook_target() -> List[Target]:
    return [
        Target(
            id=uuid4(),
            target="Target 1",
        )
    ]


@pytest.fixture(scope="session")
def notebook_focuses() -> List[Focus]:
    return [
        Focus(
            id=uuid4(),
            targets=[],
            created_at=str(fake.date_time(tzinfo=timezone.utc)),
            theme="mobilite",
        ),
        Focus(
            id=uuid4(),
            targets=[],
            created_at=str(fake.date_time(tzinfo=timezone.utc)),
            theme="logement",
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
                    code="27",
                    libelle="Entretenir ou réparer son véhicule",
                    valeur="NON_ABORDEE",
                ),
                Objectif(
                    code="25",
                    libelle="Faire un point complet sur sa mobilité",
                    valeur="EN_COURS",
                ),
                Objectif(code="26", libelle="Accéder à un véhicule", valeur="EN_COURS"),
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
        targets=[],
        theme="mobilite",
        created_at=str(fake.date_time(tzinfo=timezone.utc)),
    )


@pytest.fixture(scope="session")
def shared_contrainte_with_no_objectif() -> Contrainte:
    return Contrainte(
        code="23",
        date=None,
        valeur="OUI",
        libelle="Développer sa mobilité",
        situations=[],
        objectifs=[
            Objectif(
                code="25",
                libelle="Faire un point complet sur sa mobilité",
                valeur="REALISE",
            ),
            Objectif(
                code="27",
                libelle="Entretenir ou réparer son véhicule",
                valeur="ABANDONNE",
            ),
        ],
    )


@pytest.fixture(scope="session")
def shared_focus_with_targets() -> Focus:
    focus_id = uuid4()
    return Focus(
        id=focus_id,
        theme="mobilite",
        created_at=str(fake.date_time(tzinfo=timezone.utc)),
        targets=[
            Target(
                id=uuid4(),
                target="Faire un point complet sur sa mobilité",
            ),
            Target(
                id=uuid4(),
                target="Travailler la mobilité psychologique",
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
                code="30",
                libelle="Travailler la mobilité psychologique",
                valeur="ABANDONNE",
            ),
            Objectif(
                code="27",
                libelle="Entretenir ou réparer son véhicule",
                valeur="NON_ABORDEE",
            ),
            Objectif(
                code="25",
                libelle="Faire un point complet sur sa mobilité",
                valeur="EN_COURS",
            ),
            Objectif(code="26", libelle="Accéder à un véhicule", valeur="EN_COURS"),
        ],
    )
