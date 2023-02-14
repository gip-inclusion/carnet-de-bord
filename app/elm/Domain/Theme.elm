module Domain.Theme exposing (..)


themeKeyToString : String -> String
themeKeyToString key =
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
