port module DiagnosticEdit.Main exposing (..)

import Browser
import Date exposing (Date)
import Diagnostic.Main exposing (ProfessionalProjectFlags, extractProfessionalProjectFromFlags)
import Domain.ProfessionalProject exposing (ProfessionalProject, Rome)
import Domain.Situation exposing (Situation)
import Domain.Theme exposing (Theme(..), themeKeyStringToType, themeKeyTypeToLabel)
import Html exposing (..)
import Html.Attributes exposing (attribute, checked, class, for, id, name, type_, value)
import Html.Events exposing (onClick, onInput)
import Html.Styled as Styled
import List.Extra
import Select
import Set exposing (Set)


type RomeData
    = Failure
    | Loading
    | NotAsked
    | Success (List Rome)


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
    , professionalProjects : List ProfessionalProjectFlags
    }


type alias ProfessionalProjectState =
    { id : Maybe String
    , rome : Maybe Rome
    , mobilityRadius : Maybe Int
    , romeData : RomeData
    , selectedRome : Maybe Rome
    , selectState : Select.State
    }


inputmode : String -> Attribute msg
inputmode name =
    attribute "inputmode" name


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
    | AddEmptyProfessionalProject
    | RemoveProject Int
    | UpdateMobilityRadius Int String
    | SelectMsg Int (Select.Msg Rome)



-- MODEL


type alias Model =
    { possibleSituationsByTheme : List RefSituation
    , selectedSituationSet : Set String
    , professionalProjects : List ProfessionalProjectState
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


extractProfessionalProjectsFromFlags : List ProfessionalProjectFlags -> List ProfessionalProject
extractProfessionalProjectsFromFlags professionalProjects =
    List.map extractProfessionalProjectFromFlags professionalProjects


initProfessionalProjectState : ProfessionalProject -> ProfessionalProjectState
initProfessionalProjectState professionalProject =
    { id = Just professionalProject.id
    , rome = professionalProject.rome
    , mobilityRadius = professionalProject.mobilityRadius
    , romeData = NotAsked
    , selectedRome = Nothing
    , selectState = Select.initState (Select.selectIdentifier "RomeSelector")
    }



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
      , professionalProjects =
            extractProfessionalProjectsFromFlags flags.professionalProjects
                |> List.map initProfessionalProjectState
      }
    , Cmd.none
    )



-- UPDATE


update : Msg -> Model -> ( Model, Cmd Msg )
update msg model =
    case msg of
        AddEmptyProfessionalProject ->
            ( { model
                | professionalProjects =
                    model.professionalProjects
                        ++ [ { id = Nothing
                             , rome = Nothing
                             , mobilityRadius = Nothing
                             , romeData = NotAsked
                             , selectedRome = Nothing
                             , selectState = Select.initState (Select.selectIdentifier "RomeSelector")
                             }
                           ]
              }
            , Cmd.none
            )

        UpdateMobilityRadius indexToUpdate value ->
            ( { model
                | professionalProjects =
                    model.professionalProjects
                        |> List.Extra.updateAt indexToUpdate
                            (\professionalProjectState ->
                                { professionalProjectState | mobilityRadius = String.toInt value }
                            )
              }
            , Cmd.none
            )

        RemoveProject indexToRemove ->
            ( { model
                | professionalProjects =
                    model.professionalProjects
                        |> List.indexedMap Tuple.pair
                        |> List.filter (\( index, _ ) -> index /= indexToRemove)
                        |> List.map (\( _, value ) -> value)
              }
            , Cmd.none
            )

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

        SelectMsg indexToUpdate selectMsg ->
            case
                List.Extra.getAt indexToUpdate model.professionalProjects
                    |> Maybe.map .selectState
                    |> Maybe.map (Select.update selectMsg)
            of
                Just ( maybeAction, updatedSelectState, selectCmds ) ->
                    case maybeAction of
                        Just (Select.Select someRome) ->
                            ( { model
                                | professionalProjects =
                                    model.professionalProjects
                                        |> List.Extra.updateAt indexToUpdate
                                            (\professionalProjectState ->
                                                { professionalProjectState | selectState = updatedSelectState, selectedRome = Just someRome }
                                            )
                              }
                            , Cmd.map (SelectMsg indexToUpdate) selectCmds
                            )

                        _ ->
                            ( model, Cmd.none )

                _ ->
                    ( model, Cmd.none )


situationsByTheme : List Situation -> List RefSituation
situationsByTheme situations =
    situations
        |> List.Extra.gatherEqualsBy .theme
        |> List.map (\( s, otherSituations ) -> { theme = s.theme, situations = s :: otherSituations, id = Nothing })
        |> List.sortBy (\{ theme } -> themeKeyTypeToLabel theme)



-- VIEW
-- Disable box-shadow on the select


selectedRomeToMenuItem : Rome -> Select.MenuItem Rome
selectedRomeToMenuItem rome =
    Select.basicMenuItem { item = rome, label = rome.label }


romeDataToMenuItems : RomeData -> List (Select.MenuItem Rome)
romeDataToMenuItems romeData =
    case romeData of
        Success data ->
            data |> List.map selectedRomeToMenuItem

        _ ->
            []


view : Model -> Html Msg
view model =
    div [ class "pt-12" ]
        [ h2
            [ class "text-france-blue" ]
            [ text "Projet(s) Professionnel(s)" ]
        , div [ class "pb-4" ]
            (model.professionalProjects
                |> List.indexedMap
                    (\index project ->
                        div [ class "fr-container shadow-dsfr rounded-lg pt-4 mt-4" ]
                            [ div [ class "fr-grid-row fr-grid-row--gutters" ]
                                [ div [ class "fr-col-8" ]
                                    [ Html.map
                                        (SelectMsg index)
                                        (Styled.toUnstyled <|
                                            Select.view
                                                ((Select.single <| Maybe.map selectedRomeToMenuItem project.rome)
                                                    |> Select.menuItems (romeDataToMenuItems project.romeData)
                                                    |> Select.state project.selectState
                                                    |> Select.searchable True
                                                )
                                        )
                                    ]
                                , div [ class "fr-col-4" ]
                                    [ div [ class "fr-input-group" ]
                                        [ label [ class "fr-label", for ("mobility-radius" ++ String.fromInt index) ] [ text "Rayon de mobilité" ]
                                        , input
                                            [ class "fr-input"
                                            , onInput (UpdateMobilityRadius index)
                                            , type_ "text"
                                            , id ("mobility-radius" ++ String.fromInt index)
                                            , name "mobility-radius[]"
                                            , value (String.fromInt (Maybe.withDefault 0 project.mobilityRadius))
                                            , inputmode "numeric"
                                            ]
                                            []
                                        ]
                                    ]
                                ]
                            , button
                                [ class "fr-btn fr-btn--secondary", type_ "button", onClick (RemoveProject index) ]
                                [ text "Supprimer" ]
                            ]
                    )
            )
        , button [ class "fr-btn", type_ "button", onClick AddEmptyProfessionalProject ] [ text "Ajouter un projet professionnel" ]
        , h2
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
