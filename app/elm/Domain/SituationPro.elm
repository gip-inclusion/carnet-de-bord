module Domain.SituationPro exposing (SituationPro, educationLevelKeyToString, geographicalAreaKeyToString, rsaRightKeyToString, workSituationKeyToString)

import Date exposing (Date)


type alias SituationPro =
    { workSituation : Maybe String
    , workSituationDate : Maybe Date
    , workSituationEndDate : Maybe Date
    , rightRqth : Bool
    , rightRsa : Maybe String
    , rightAre : Bool
    , rightAss : Bool
    , rightBonus : Bool
    , geographicalArea : Maybe String
    , educationLevel : Maybe String
    , wantedJobs : List String
    }


rsaRightKeyToString : String -> String
rsaRightKeyToString key =
    "RSA - "
        ++ (case key of
                "rsa_droit_ouvert_et_suspendu" ->
                    "Droit ouvert et suspendu"

                "rsa_droit_ouvert_versable" ->
                    "Droit ouvert et versable"

                "rsa_droit_ouvert_versement_suspendu" ->
                    "Droit ouvert mais versement suspendu"

                _ ->
                    "Droit non renseigné"
           )


geographicalAreaKeyToString : String -> String
geographicalAreaKeyToString key =
    case key of
        "none" ->
            "Aucune"

        "less_10" ->
            "Moins de 10 km"

        "between_10_20" ->
            "Entre 10 et 20 km"

        "between_20_30" ->
            "Entre 20 et 30 km"

        "plus_30" ->
            "Plus de 30 km"

        _ ->
            ""


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
