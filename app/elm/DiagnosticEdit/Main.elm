port module DiagnosticEdit.Main exposing (..)

import Browser
import Domain.Situation exposing (Situation)
import Domain.Theme exposing (Theme(..), themeKeyStringToType, themeKeyTypeToKeyString)
import Html exposing (..)
import Html.Attributes exposing (checked, class, for, id, name, type_, value)
import Html.Events exposing (onClick)


type alias SituationFlag =
    { id : String
    , description : String
    , theme : String
    }


type alias Flags =
    { situations : List SituationFlag
    }


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


type alias SelectedSituationPort =
    { description : String
    , theme : String
    }


type Msg
    = ToggleSelectedSituation SelectedSituation



-- MODEL


type alias Model =
    { possibleSituations : List Situation
    , selectedSituations : List SelectedSituation
    }


extractSituationOptionsFromFlags : List SituationFlag -> List Situation
extractSituationOptionsFromFlags flags =
    List.filterMap extractSituationOptionFromFlag flags


extractSituationOptionFromFlag : SituationFlag -> Maybe Situation
extractSituationOptionFromFlag flag =
    Maybe.map
        (\theme ->
            { id = flag.id
            , description = flag.description
            , theme = theme
            }
        )
        (themeKeyStringToType flag.theme)



-- INIT


init : Flags -> ( Model, Cmd msg )
init flags =
    let
        -- TODO: Get it from the DB
        situation1 =
            { id = "id1", description = "Contrainte horaires", theme = ContraintesFamiliales }

        situation2 =
            { id = "id2", description = "Attend un enfant ou plus", theme = ContraintesFamiliales }

        situation9 =
            { id = "id9", description = "En situation de surendettement", theme = DifficulteFinanciere }
    in
    ( { possibleSituations = extractSituationOptionsFromFlags flags.situations
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
            let
                newModel =
                    if
                        List.any
                            (\s -> selectedSituation.description == s.description && selectedSituation.theme == s.theme)
                            model.selectedSituations
                    then
                        { model
                            | selectedSituations =
                                model.selectedSituations
                                    |> List.filter (\s -> not (selectedSituation.description == s.description && selectedSituation.theme == s.theme))
                        }

                    else
                        { model | selectedSituations = selectedSituation :: model.selectedSituations }
            in
            ( newModel
            , sendSelectedSituations
                (newModel.selectedSituations
                    |> List.map (\situation -> { description = situation.description, theme = themeKeyTypeToKeyString situation.theme })
                )
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



-- PORTS


port sendSelectedSituations : List SelectedSituationPort -> Cmd msg
