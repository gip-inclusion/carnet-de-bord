module Domain.Theme exposing (Theme(..), printTheme, themeKeyStringToType, themeKeyTypeToLabel)

import GraphQL.Enum.Ref_theme_enum as RefTheme exposing (Ref_theme_enum)


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


printTheme : Ref_theme_enum -> String
printTheme key =
    case key of
        RefTheme.Logement ->
            "Logement"

        RefTheme.Emploi ->
            "Emploi"

        RefTheme.Formation ->
            "Formation"

        RefTheme.Difficulte_administrative ->
            "Difficultés administratives"

        RefTheme.Difficulte_financiere ->
            "Difficultés financières"

        RefTheme.Mobilite ->
            "Mobilité"

        RefTheme.Sante ->
            "Santé"

        RefTheme.Contraintes_familiales ->
            "Contraintes familiales"

        RefTheme.Maitrise_langue ->
            "Maîtrise de la langue française"

        RefTheme.Numerique ->
            "Numérique"

        RefTheme.Choisir_un_metier ->
            "Emploi"

        RefTheme.Creer_une_entreprise ->
            "Emploi"

        RefTheme.Preparer_sa_candidature ->
            "Emploi"

        RefTheme.S_ouvrir_a_l_international ->
            "Emploi"

        RefTheme.Se_former ->
            "Formation"

        RefTheme.Trouver_un_emploi ->
            "Emploi"


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
