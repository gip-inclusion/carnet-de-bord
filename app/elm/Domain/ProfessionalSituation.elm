module Domain.ProfessionalSituation exposing (ProfessionalSituation, educationLevelKeyToString, workSituationKeyToString)

import Date exposing (Date)


type alias ProfessionalSituation =
    { workSituation : Maybe String
    , workSituationDate : Maybe Date
    , workSituationEndDate : Maybe Date
    , rightRqth : Bool
    , geographicalArea : Maybe Int
    , educationLevel : Maybe String
    , professionalProjects : List String
    , lastJobEndedAt : Maybe Date
    }


educationLevelKeyToString : String -> String
educationLevelKeyToString key =
    case key of
        "AFS" ->
            "Aucune formation scolaire"

        "C12" ->
            "2nd ou 1ère achevée"

        "C3A" ->
            "BEPC ou 3ème achevée"

        "CFG" ->
            "4ème achevée"

        "CP4" ->
            "Primaire à 4ème"

        "NV5" ->
            "CAP, BEP ou équivalent"

        "NV4" ->
            "Bac ou équivalent"

        "NV3" ->
            "Bac+2 ou équivalent"

        "NV2" ->
            "Bac+3, Bac+4 ou équivalent"

        "NV1" ->
            "Bac+5 et plus ou équivalent"

        _ ->
            ""


workSituationKeyToString : String -> String
workSituationKeyToString key =
    case key of
        "recherche_emploi" ->
            "En recherche d'emploi"

        "recherche_formation" ->
            "En recherche de formation"

        "recherche_alternance" ->
            "En recherche d’alternance"

        "recherche_stage" ->
            "En recherche de stage"

        "emploi" ->
            "En emploi"

        "formation" ->
            "En formation"

        "stage" ->
            "En stage"

        "alternance" ->
            "En alternance"

        "service_civique" ->
            "En service civique"

        "iae" ->
            "En IAE"

        "interim" ->
            "En interim"

        "construction_projet" ->
            "En construction de projet"

        "projet_entrepreneurial" ->
            "En projet entrepreneurial"

        "entrepreneur" ->
            "Entrepreneur"

        "etudiant" ->
            "Etudiant"

        "scolarisé" ->
            "Scolarisé"

        "enretraite" ->
            "En retraite / pré-retraite"

        "maladie" ->
            "Longue maladie"

        "invalidite" ->
            "En invalidité de travail"

        "conge_parental" ->
            "Congé parental"

        "au_foyer" ->
            "Au foyer"

        "autre" ->
            "Autre"

        "cdi_temps_plein" ->
            "CDI temps complet"

        "cdi_temps_partiel" ->
            "CDI temps partiel"

        "cdd_temps_plein" ->
            "CDD temps complet"

        "cdd_temps_partiel" ->
            "CDD temps partiel"

        "intermittent" ->
            "Intermittent du spectacle "

        _ ->
            ""
