port module DiagnosticEdit.Main exposing (..)

import Browser
import Domain.Situation exposing (Situation)
import Domain.Theme exposing (Theme(..), themeKeyStringToType, themeKeyTypeToLabel, themeTypeToKeyString)
import Html exposing (..)
import Html.Attributes exposing (checked, class, for, id, name, type_, value)
import Html.Events exposing (onClick)
import List.Extra
import Set exposing (Set)


type alias RefSituationFlag =
    { id : String
    , description : String
    , theme : String
    }


type alias NotebookSituationFlag =
    { refSituation : RefSituationFlag
    , id : String
    }


type alias Flags =
    { refSituations : List RefSituationFlag
    , situations : List NotebookSituationFlag
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
    { id : String
    , description : String
    , theme : Theme
    }


type alias RefSituation =
    { theme : Theme, situations : List Situation, id : Maybe String }


type Msg
    = ToggleSelectedSituation SelectedSituation



-- MODEL


type alias Model =
    { possibleSituationsByTheme : List RefSituation
    , selectedSituationSet : Set String
    }


extractSituationOptionsFromFlags : List RefSituationFlag -> List Situation
extractSituationOptionsFromFlags flags =
    List.filterMap extractSituationOptionFromFlag flags


extractSituationOptionFromFlag : RefSituationFlag -> Maybe Situation
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
    ( { possibleSituationsByTheme =
            extractSituationOptionsFromFlags flags.refSituations
                |> situationsByTheme
      , selectedSituationSet =
            flags.situations
                |> List.map .refSituation
                |> List.map .id
                |> Set.fromList
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
                    if Set.member selectedSituation.id model.selectedSituationSet then
                        { model
                            | selectedSituationSet =
                                model.selectedSituationSet
                                    |> Set.remove selectedSituation.id
                        }

                    else
                        { model
                            | selectedSituationSet =
                                model.selectedSituationSet
                                    |> Set.insert selectedSituation.id
                        }
            in
            ( newModel
            , sendSelectedSituations (newModel.selectedSituationSet |> Set.toList)
            )


situationsByTheme : List Situation -> List RefSituation
situationsByTheme situations =
    situations
        |> List.Extra.gatherEqualsBy .theme
        |> List.map (\( s, otherSituations ) -> { theme = s.theme, situations = s :: otherSituations, id = Nothing })
        |> List.sortBy (\{ theme } -> themeKeyTypeToLabel theme)



-- VIEW


view : Model -> Html Msg
view model =
    div [ class "pt-12" ]
        [ h2
            [ class "text-france-blue" ]
            [ text "Situation Personnelle" ]
        , div []
            (model.possibleSituationsByTheme
                |> List.map
                    (\{ theme, situations } ->
                        div [ class "fr-form-group pl-0 pb-8 border-b" ]
                            [ fieldset [ class "fr-fieldset" ]
                                [ legend [ class "fr-fieldset__legend fr-text-bold" ] [ text <| themeKeyTypeToLabel theme ]
                                , div [ class "fr-fieldset__content" ]
                                    [ div [ class "fr-grid-row fr-grid-row--gutters" ]
                                        (List.map
                                            (situationCheckboxView model.selectedSituationSet)
                                            situations
                                        )
                                    ]
                                ]
                            ]
                    )
            )
        ]


situationCheckboxView : Set String -> Situation -> Html Msg
situationCheckboxView selectedSituationSet situation =
    let
        checkboxId =
            "checkbox-radio-group" ++ situation.description
    in
    div [ class "fr-col-sm-12 fr-col-md-6 fr-col-lg-4 fr-col-xl-4 fr-checkbox-group !mt-0" ]
        [ input
            [ type_ "checkbox"
            , id checkboxId
            , name "checkbox-radio-group"
            , value situation.description
            , checked <| Set.member situation.id selectedSituationSet
            , onClick <| ToggleSelectedSituation { id = situation.id, description = situation.description, theme = situation.theme }
            ]
            []
        , label [ class "fr-label", for checkboxId ] [ text situation.description ]
        ]



-- PORTS


port sendSelectedSituations : List String -> Cmd msg
