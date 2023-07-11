from datetime import datetime
from typing import List
from uuid import UUID

from cdb.api.db.models.ref_situation import NotebookSituation as SituationCdb
from cdb.api.db.models.ref_situation import RefSituation
from cdb.api.domain.situations import (
    SituationToAdd,
    diff_situations,
)
from cdb.pe.models.dossier_individu_api import Contrainte, Situation


def test_merge_contraintes_to_situations_returns_empty(
    ref_situations: List[RefSituation],
):
    contraintes: List[Contrainte] = []
    notebook_situations = []

    result = diff_situations(contraintes, ref_situations, notebook_situations)

    assert result.situations_to_add == []
    assert result.situations_to_delete == []


def test_merge_contraintes_to_situations_returns_empty_when_no_ref_situations(caplog):
    contraintes: List[Contrainte] = [
        Contrainte(
            code="23",
            libelle="Développer sa mobilité",
            valeur="OUI",
            date=datetime.fromisoformat("2023-05-12T12:54:39.000+00:00"),
            situations=[
                Situation(
                    code="6",
                    libelle="Aucun moyen de transport à disposition",
                    valeur="OUI",
                )
            ],
            objectifs=[],
        )
    ]

    result = diff_situations(
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
            code="23",
            libelle="Développer sa mobilité",
            valeur="OUI",
            date=datetime.fromisoformat("2023-05-12T12:54:39.000+00:00"),
            situations=[
                Situation(
                    code="6",
                    libelle="Aucun moyen de transport à disposition",
                    valeur="OUI",
                )
            ],
            objectifs=[],
        )
    ]
    notebook_situations = []

    result = diff_situations(contraintes, ref_situations, notebook_situations)

    assert result.situations_to_add == [
        SituationToAdd(
            situation_id=ref_situation_aucun_moyen_transport.id,
            created_at=datetime.fromisoformat("2023-05-12T12:54:39.000+00:00"),
        )
    ]
    assert result.situations_to_delete == []


def test_merge_contraintes_use_only_active_contraintes_(
    ref_situations: List[RefSituation],
):
    contraintes: List[Contrainte] = [
        Contrainte(
            code="23",
            libelle="Développer sa mobilité",
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
            objectifs=[],
        )
    ]
    notebook_situations = []

    result = diff_situations(contraintes, ref_situations, notebook_situations)

    assert result.situations_to_add == []
    assert result.situations_to_delete == []


def test_merge_contraintes_to_situations_returns_only_validated_situations(
    ref_situations: List[RefSituation],
    ref_situation_aucun_moyen_transport: RefSituation,
):
    contraintes: List[Contrainte] = [
        Contrainte(
            code="23",
            libelle="Développer sa mobilité",
            valeur="OUI",
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
            objectifs=[],
        )
    ]
    notebook_situations = []

    result = diff_situations(contraintes, ref_situations, notebook_situations)

    assert result.situations_to_add == [
        SituationToAdd(
            situation_id=ref_situation_aucun_moyen_transport.id,
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
            code="23",
            libelle="Développer sa mobilité",
            valeur="OUI",
            date=datetime.fromisoformat("2023-05-12T12:54:39.000+00:00"),
            situations=[
                Situation(
                    code="6",
                    libelle="Aucun moyen de transport à disposition",
                    valeur="OUI",
                )
            ],
            objectifs=[],
        )
    ]
    notebook_situations: List[SituationCdb] = [
        SituationCdb(
            id=UUID("f9a9c869-460d-4190-942c-3c31b588d547"),
            situationId=ref_situation_aucun_moyen_transport.id,
            createdAt=datetime.fromisoformat("2023-05-11"),
        )
    ]

    result = diff_situations(
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
            code="23",
            libelle="Développer sa mobilité",
            valeur="OUI",
            date=datetime.fromisoformat("2023-05-12T12:54:39.000+00:00"),
            situations=[
                Situation(
                    code="6",
                    libelle="Aucun moyen de transport à disposition",
                    valeur="OUI",
                )
            ],
            objectifs=[],
        )
    ]
    notebook_situations: List[SituationCdb] = [
        SituationCdb(
            id=UUID("f9a9c869-460d-4190-942c-3c31b588d547"),
            situationId=ref_situation_dependant_des_transports.id,
            createdAt=datetime.fromisoformat("2023-05-11"),
        )
    ]
    result = diff_situations(
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
