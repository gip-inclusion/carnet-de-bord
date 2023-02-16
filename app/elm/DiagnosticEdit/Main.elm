module DiagnosticEdit.Main exposing (..)

import Browser
import Domain.Situation exposing (Situation)
import Domain.Theme exposing (Theme(..), themeKeyTypeToKeyString)
import Html exposing (..)
import Html.Attributes exposing (checked, class, for, id, name, type_, value)
import Html.Events exposing (onClick)


type alias Flags =
    {}


main : Program Flags Model Msg
main =
    Browser.element
        { init = init
        , view = view
        , update = update
        , subscriptions = \_ -> Sub.none
        }


type alias SelectedSituation =
    { description : String
    , theme : Theme
    }


type Msg
    = ToggleSelectedSituation SelectedSituation



-- MODEL


type alias Model =
    { possibleSituations : List Situation
    , selectedSituations : List SelectedSituation
    }



-- INIT


init : Flags -> ( Model, Cmd msg )
init _ =
    let
        -- TODO: Get it from the DB
        situation1 =
            { id = "id1", description = "Contrainte horaires", theme = ContraintesFamiliales }

        situation2 =
            { id = "id2", description = "Attend un enfant ou plus", theme = ContraintesFamiliales }

        situation3 =
            { id = "id3", description = "Enfant(s) de moins de 3 ans sans solution de garde", theme = ContraintesFamiliales }

        situation4 =
            { id = "id4", description = "Besoin d'être guidé dans le cadre d'un accès aux droits", theme = DifficulteAdministrative }

        situation5 =
            { id = "id5", description = "Rencontre des difficultés juridiques", theme = DifficulteAdministrative }

        situation6 =
            { id = "id6", description = "Difficulté dans la gestion d'un budget", theme = DifficulteFinanciere }

        situation7 =
            { id = "id7", description = "Baisse des ressources", theme = DifficulteFinanciere }

        situation8 =
            { id = "id8", description = "Sans aucune ressource", theme = DifficulteFinanciere }

        situation9 =
            { id = "id9", description = "En situation de surendettement", theme = DifficulteFinanciere }
    in
    ( { possibleSituations =
            [ situation1
            , situation2
            , situation3
            , situation4
            , situation5
            , situation6
            , situation7
            , situation8
            , situation9
            ]
      , selectedSituations =
            [ { description = situation1.description, theme = situation1.theme }
            , { description = situation2.description, theme = situation2.theme }
            , { description = situation9.description, theme = situation9.theme }
            ]
      }
    , Cmd.none
    )



-- UPDATE


update : Msg -> Model -> ( Model, Cmd Msg )
update msg model =
    case msg of
        ToggleSelectedSituation selectedSituation ->
            if
                List.any
                    (\s -> selectedSituation.description == s.description && selectedSituation.theme == s.theme)
                    model.selectedSituations
            then
                ( { model
                    | selectedSituations =
                        model.selectedSituations
                            |> List.filter (\s -> not (selectedSituation.description == s.description && selectedSituation.theme == s.theme))
                  }
                , Cmd.none
                )

            else
                ( { model | selectedSituations = selectedSituation :: model.selectedSituations }
                , Cmd.none
                )


unique : List a -> List a
unique l =
    let
        incUnique : a -> List a -> List a
        incUnique elem lst =
            if List.member elem lst then
                lst

            else
                elem :: lst
    in
    List.foldr incUnique [] l


getThemes : List Situation -> List Theme
getThemes situations =
    situations
        |> List.map (\situation -> situation.theme)
        |> unique
        |> List.sortBy (\theme -> themeKeyTypeToKeyString theme)



-- VIEW


view : Model -> Html Msg
view model =
    div [ class "pt-12" ]
        [ h2
            [ class "text-france-blue" ]
            [ text "Situation Personnelle" ]
        , div []
            (getThemes
                model.possibleSituations
                |> List.map
                    (\theme ->
                        div [ class "fr-form-group pl-0 pb-8 border-b" ]
                            [ fieldset [ class "fr-fieldset" ]
                                [ div [ class "fr-fieldset__content" ]
                                    [ h3 [] [ text <| themeKeyTypeToKeyString theme ]
                                    , div [ class "grid grid-cols-3" ]
                                        (model.possibleSituations
                                            |> List.filter (\situation -> situation.theme == theme)
                                            |> List.map (situationCheckboxView model.selectedSituations)
                                        )
                                    ]
                                ]
                            ]
                    )
            )
        ]


situationCheckboxView : List SelectedSituation -> Situation -> Html Msg
situationCheckboxView selectedSituations situation =
    let
        checkboxId =
            "checkbox-radio-group" ++ situation.description
    in
    div [ class "fr-checkbox-group" ]
        [ input
            [ type_ "checkbox"
            , id checkboxId
            , name "checkbox-radio-group"
            , value situation.description
            , checked <| List.any (\possibleSituation -> situation.description == possibleSituation.description) selectedSituations
            , onClick <| ToggleSelectedSituation { description = situation.description, theme = situation.theme }
            ]
            []
        , label [ class "fr-label", for checkboxId ] [ text situation.description ]
        ]
