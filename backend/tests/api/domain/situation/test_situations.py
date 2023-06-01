from datetime import datetime
from typing import List
from uuid import UUID

import pytest

from cdb.api.db.models.ref_situation import NotebookSituation as SituationCdb
from cdb.api.db.models.ref_situation import RefSituation
from cdb.api.domain.situation.situations import (
    SituationToAdd,
    merge_contraintes_to_situations,
)
from cdb.pe.models.contrainte import Contrainte, Situation


def test_merge_contraintes_to_situations_returns_empty(
    ref_situations: List[RefSituation],
):
    contraintes: List[Contrainte] = []
    notebook_situations = []

    result = merge_contraintes_to_situations(
        contraintes, ref_situations, notebook_situations
    )

    assert result.situations_to_add == []
    assert result.situations_to_delete == []


def test_merge_contraintes_to_situations_returns_empty_when_no_ref_situations(caplog):
    contraintes: List[Contrainte] = [
        Contrainte(
            id=23,
            nom="Développer sa mobilité",
            valeur="CLOTUREE",
            date=datetime.fromisoformat("2023-05-12T12:54:39.000+00:00"),
            situations=[
                Situation(
                    code="6",
                    libelle="Aucun moyen de transport à disposition",
                    valeur="OUI",
                )
            ],
        )
    ]

    result = merge_contraintes_to_situations(
        contraintes=contraintes,
        ref_situations=[],
        notebook_situations=[],
    )

    assert result.situations_to_add == []
    assert result.situations_to_delete == []
    assert (
        "No ref_situation with description='Aucun moyen de transport à disposition' found."  # noqa: E501
        in caplog.text
    )


def test_merge_contraintes_to_situations_returns_one_situation_to_add(
    ref_situations: List[RefSituation],
    ref_situation_aucun_moyen_transport: RefSituation,
):
    contraintes: List[Contrainte] = [
        Contrainte(
            id=23,
            nom="Développer sa mobilité",
            valeur="CLOTUREE",
            date=datetime.fromisoformat("2023-05-12T12:54:39.000+00:00"),
            situations=[
                Situation(
                    code="6",
                    libelle="Aucun moyen de transport à disposition",
                    valeur="OUI",
                )
            ],
        )
    ]
    notebook_situations = []

    result = merge_contraintes_to_situations(
        contraintes, ref_situations, notebook_situations
    )

    assert result.situations_to_add == [
        SituationToAdd(
            situation_id=ref_situation_aucun_moyen_transport.id,
            created_at=datetime.fromisoformat("2023-05-12T12:54:39.000+00:00"),
        )
    ]
    assert result.situations_to_delete == []


def test_merge_contraintes_to_situations_returns_only_validated_situations(
    ref_situations: List[RefSituation],
):
    contraintes: List[Contrainte] = [
        Contrainte(
            id=23,
            nom="Développer sa mobilité",
            valeur="CLOTUREE",
            date=datetime.fromisoformat("2023-05-12T12:54:39.000+00:00"),
            situations=[
                Situation(
                    code="6",
                    libelle="Aucun moyen de transport à disposition",
                    valeur="OUI",
                ),
                Situation(
                    code="7",
                    libelle="Dépendant des transports en commun",
                    valeur="NON_ABORDEE",
                ),
            ],
        )
    ]
    notebook_situations = []

    result = merge_contraintes_to_situations(
        contraintes, ref_situations, notebook_situations
    )

    assert result.situations_to_add == [
        SituationToAdd(
            situation_id=UUID("f6fd82aa-781b-4eec-8c27-fc4312d180ed"),
            created_at=datetime.fromisoformat("2023-05-12T12:54:39.000+00:00"),
        )
    ]
    assert result.situations_to_delete == []


def test_merge_contraintes_to_situations_does_not_return_already_existing_situations(
    ref_situations: List[RefSituation],
    ref_situation_aucun_moyen_transport: RefSituation,
):
    contraintes: List[Contrainte] = [
        Contrainte(
            id=23,
            nom="Développer sa mobilité",
            valeur="CLOTUREE",
            date=datetime.fromisoformat("2023-05-12T12:54:39.000+00:00"),
            situations=[
                Situation(
                    code="6",
                    libelle="Aucun moyen de transport à disposition",
                    valeur="OUI",
                )
            ],
        )
    ]
    notebook_situations: List[SituationCdb] = [
        SituationCdb(
            id=UUID("f9a9c869-460d-4190-942c-3c31b588d547"),
            situationId=ref_situation_aucun_moyen_transport.id,
            createdAt=datetime.fromisoformat("2023-05-11"),
        )
    ]

    result = merge_contraintes_to_situations(
        contraintes,
        ref_situations,
        notebook_situations,
    )

    assert result.situations_to_add == []
    assert result.situations_to_delete == []


# TODO
# - une situation nouvellement créée chez PE mais
#   supprimée dans Cdb (deleted_at is not None)
# - reconcilier les situations à supprimer
#   (ie. qui existent dans Cdb mais qui n'ont pas été envoyées par PE)


def test_merge_contraintes_to_situations_return_situation_to_delete(
    ref_situations: List[RefSituation],
    ref_situation_aucun_moyen_transport: RefSituation,
    ref_situation_dependant_des_transports: RefSituation,
):
    contraintes: List[Contrainte] = [
        Contrainte(
            id=23,
            nom="Développer sa mobilité",
            valeur="CLOTUREE",
            date=datetime.fromisoformat("2023-05-12T12:54:39.000+00:00"),
            situations=[
                Situation(
                    code="6",
                    libelle="Aucun moyen de transport à disposition",
                    valeur="OUI",
                )
            ],
        )
    ]
    notebook_situations: List[SituationCdb] = [
        SituationCdb(
            id=UUID("f9a9c869-460d-4190-942c-3c31b588d547"),
            situationId=ref_situation_dependant_des_transports.id,
            createdAt=datetime.fromisoformat("2023-05-11"),
        )
    ]
    result = merge_contraintes_to_situations(
        contraintes,
        ref_situations,
        notebook_situations,
    )

    assert result.situations_to_add == [
        SituationToAdd(
            situation_id=ref_situation_aucun_moyen_transport.id,
            created_at=datetime.fromisoformat("2023-05-12T12:54:39.000+00:00"),
        )
    ]
    assert result.situations_to_delete == [UUID("f9a9c869-460d-4190-942c-3c31b588d547")]


@pytest.fixture(scope="session")
def ref_situation_aucun_moyen_transport() -> RefSituation:
    return RefSituation(
        id=UUID("f6fd82aa-781b-4eec-8c27-fc4312d180ed"),
        description="Aucun moyen de transport à disposition",
        theme="mobilite",
    )


@pytest.fixture(scope="session")
def ref_situation_dependant_des_transports() -> RefSituation:
    return RefSituation(
        id=UUID("d2d61c88-bc4d-442d-ad4d-ec4ea30c3cd5"),
        description="Dépendant des transports en commun",
        theme="mobilite",
    )


@pytest.fixture(scope="session")
def ref_situations(
    ref_situation_dependant_des_transports: RefSituation,
    ref_situation_aucun_moyen_transport: RefSituation,
) -> List[RefSituation]:
    return [
        ref_situation_dependant_des_transports,
        ref_situation_aucun_moyen_transport,
    ]
