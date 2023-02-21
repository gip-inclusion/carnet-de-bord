module Domain.Theme exposing (..)


type Theme
    = Logement
    | Emploi
    | Formation
    | DifficulteAdministrative
    | DifficulteFinanciere
    | Mobilite
    | Sante
    | ContraintesFamiliales
    | MaitriseLangue
    | Numerique
    | Inconnu


themeKeyStringToType : String -> Maybe Theme
themeKeyStringToType key =
    case key of
        "logement" ->
            Just Logement

        "emploi" ->
            Just Emploi

        "formation" ->
            Just Formation

        "difficulte_administrative" ->
            Just DifficulteAdministrative

        "difficulte_financiere" ->
            Just DifficulteFinanciere

        "mobilite" ->
            Just Mobilite

        "sante" ->
            Just Sante

        "contraintes_familiales" ->
            Just ContraintesFamiliales

        "maitrise_langue" ->
            Just MaitriseLangue

        "numerique" ->
            Just Numerique

        _ ->
            Nothing


themeKeyStringToString : String -> String
themeKeyStringToString key =
    case key of
        "logement" ->
            "Logement"

        "emploi" ->
            "Emploi"

        "formation" ->
            "Formation"

        "difficulte_administrative" ->
            "Difficultés administratives"

        "difficulte_financiere" ->
            "Difficultés financières"

        "mobilite" ->
            "Mobilité"

        "sante" ->
            "Santé"

        "contraintes_familiales" ->
            "Contraintes familiales"

        "maitrise_langue" ->
            "Maîtrise de la langue française"

        "numerique" ->
            "Numérique"

        _ ->
            ""


themeKeyTypeToLabel : Theme -> String
themeKeyTypeToLabel key =
    case key of
        Logement ->
            "Logement"

        Emploi ->
            "Emploi"

        Formation ->
            "Formation"

        DifficulteAdministrative ->
            "Difficultés administratives"

        DifficulteFinanciere ->
            "Difficultés financières"

        Mobilite ->
            "Mobilité"

        Sante ->
            "Santé"

        ContraintesFamiliales ->
            "Contraintes familiales"

        MaitriseLangue ->
            "Maîtrise de la langue française"

        Numerique ->
            "Numérique"

        Inconnu ->
            "Inconnu"


themeTypeToKeyString : Theme -> String
themeTypeToKeyString key =
    case key of
        Logement ->
            "logement"

        Emploi ->
            "emploi"

        Formation ->
            "formation"

        DifficulteAdministrative ->
            "difficulte_administrative"

        DifficulteFinanciere ->
            "difficulte_financiere"

        Mobilite ->
            "mobilite"

        Sante ->
            "sante"

        ContraintesFamiliales ->
            "contraintes_familiales"

        MaitriseLangue ->
            "maitrise_langue"

        Numerique ->
            "numerique"

        Inconnu ->
            "inconnu"
