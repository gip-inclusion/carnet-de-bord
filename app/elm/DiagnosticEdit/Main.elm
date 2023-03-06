port module DiagnosticEdit.Main exposing (..)

import Browser
import Debouncer.Messages as Debouncer exposing (debounce, fromSeconds, provideInput, toDebouncer)
import Debug
import Diagnostic.Main exposing (ProfessionalProjectFlags, extractProfessionalProjectFromFlags, professionalProjectView)
import Domain.ProfessionalProject exposing (ProfessionalProject, Rome)
import Domain.Situation exposing (Situation)
import Domain.Theme exposing (Theme(..), themeKeyStringToType, themeKeyTypeToLabel)
import Html exposing (..)
import Html.Attributes exposing (attribute, checked, class, for, id, name, type_, value)
import Html.Events exposing (onClick, onInput)
import Html.Styled as Styled
import Http
import Json.Decode
import Json.Encode
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
    , token : String
    , serverUrl : String
    }


type alias ProfessionalProjectState =
    { id : Maybe String
    , rome : Maybe Rome
    , mobilityRadius : Maybe Int
    , romeData : RomeData
    , selectedRome : Maybe Rome
    , selectState : Select.State
    }


type alias ProfessionalProjectOut =
    { id : Maybe String
    , mobilityRadius : Maybe Int
    , romeId : Maybe String
    }


toProfessionalProjectOut : ProfessionalProjectState -> ProfessionalProjectOut
toProfessionalProjectOut state =
    { id = state.id
    , mobilityRadius = state.mobilityRadius
    , romeId = Maybe.map .id state.selectedRome
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
    | OpenRomeSearch Int
    | SelectMsg Int (Select.Msg Rome)
    | MsgFetchJobTitlesDebouncer (Debouncer.Msg Msg)
    | FetchJobTitles Int String
    | JobTitlesFetched Int (Result Http.Error (List Rome))



-- MODEL


type alias Model =
    { possibleSituationsByTheme : List RefSituation
    , selectedSituationSet : Set String
    , professionalProjects : List ProfessionalProjectState
    , token : String
    , serverUrl : String
    , fetchJobTitlesDebouncer : Debouncer.Debouncer Msg
    , activeRomeSearchIndex : Maybe Int
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
    , romeData = Maybe.withDefault NotAsked (Maybe.map (\value -> Success [ value ]) professionalProject.rome)
    , selectedRome = professionalProject.rome
    , selectState = Select.initState (Select.selectIdentifier ("RomeSelector" ++ professionalProject.id))
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
      , token = flags.token
      , serverUrl = flags.serverUrl
      , fetchJobTitlesDebouncer = debounce (fromSeconds 0.5) |> toDebouncer
      , activeRomeSearchIndex = Nothing
      }
    , Cmd.none
    )



-- UPDATE


fetchJobTitlesDebouncerConfig : Debouncer.UpdateConfig Msg Model
fetchJobTitlesDebouncerConfig =
    { mapMsg = MsgFetchJobTitlesDebouncer
    , getDebouncer = .fetchJobTitlesDebouncer
    , setDebouncer = \debouncer model -> { model | fetchJobTitlesDebouncer = debouncer }
    }


update : Msg -> Model -> ( Model, Cmd Msg )
update msg model =
    case msg of
        AddEmptyProfessionalProject ->
            let
                newModel =
                    { model
                        | professionalProjects =
                            model.professionalProjects
                                ++ [ { id = Nothing
                                     , rome = Nothing
                                     , mobilityRadius = Nothing
                                     , romeData = NotAsked
                                     , selectedRome = Nothing
                                     , selectState = Select.initState (Select.selectIdentifier ("RomeSelector" ++ String.fromInt (List.length model.professionalProjects)))
                                     }
                                   ]
                    }
            in
            ( newModel
            , newModel.professionalProjects
                |> List.map toProfessionalProjectOut
                |> sendUpdatedProfessionalProjects
            )

        UpdateMobilityRadius indexToUpdate value ->
            let
                newModel =
                    { model
                        | professionalProjects =
                            model.professionalProjects
                                |> List.Extra.updateAt indexToUpdate
                                    (\professionalProjectState ->
                                        { professionalProjectState | mobilityRadius = String.toInt value }
                                    )
                    }
            in
            ( newModel
            , newModel.professionalProjects
                |> List.map toProfessionalProjectOut
                |> sendUpdatedProfessionalProjects
            )

        RemoveProject indexToRemove ->
            let
                newModel =
                    { model
                        | professionalProjects =
                            model.professionalProjects
                                |> List.indexedMap Tuple.pair
                                |> List.filter (\( index, _ ) -> index /= indexToRemove)
                                |> List.map (\( _, value ) -> value)
                    }
            in
            ( newModel
            , newModel.professionalProjects
                |> List.map toProfessionalProjectOut
                |> sendUpdatedProfessionalProjects
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
            , newModel.selectedSituationSet
                |> Set.toList
                |> sendSelectedSituations
            )

        SelectMsg indexToUpdate selectMsg ->
            case
                List.Extra.getAt indexToUpdate model.professionalProjects
                    |> Maybe.map .selectState
                    |> Maybe.map (Select.update selectMsg)
            of
                Just ( maybeAction, updatedSelectState, selectCmds ) ->
                    let
                        newModel =
                            { model
                                | professionalProjects =
                                    model.professionalProjects
                                        |> List.Extra.updateAt indexToUpdate
                                            (\professionalProjectState ->
                                                { professionalProjectState | selectState = updatedSelectState }
                                            )
                            }

                        newCmds =
                            Cmd.map (SelectMsg indexToUpdate) selectCmds
                    in
                    case maybeAction of
                        Just (Select.Select someRome) ->
                            ( { newModel
                                | professionalProjects =
                                    newModel.professionalProjects
                                        |> List.Extra.updateAt indexToUpdate
                                            (\professionalProjectState ->
                                                { professionalProjectState | selectedRome = Just someRome }
                                            )
                                , activeRomeSearchIndex = Nothing
                              }
                            , Cmd.batch
                                [ newCmds
                                , newModel.professionalProjects
                                    |> List.map toProfessionalProjectOut
                                    |> sendUpdatedProfessionalProjects
                                ]
                            )

                        Just (Select.InputChange value) ->
                            let
                                ( debouncerModel, debouncerCmds ) =
                                    Debouncer.update update
                                        fetchJobTitlesDebouncerConfig
                                        (FetchJobTitles indexToUpdate value
                                            |> provideInput
                                        )
                                        newModel
                            in
                            ( debouncerModel, Cmd.batch [ newCmds, debouncerCmds ] )

                        _ ->
                            if Select.isMenuOpen updatedSelectState then
                                ( newModel
                                , Cmd.batch
                                    [ newCmds
                                    , newModel.professionalProjects
                                        |> List.map toProfessionalProjectOut
                                        |> sendUpdatedProfessionalProjects
                                    ]
                                )

                            else
                                ( { newModel | activeRomeSearchIndex = Nothing }
                                , Cmd.batch
                                    [ newCmds
                                    , newModel.professionalProjects
                                        |> List.map toProfessionalProjectOut
                                        |> sendUpdatedProfessionalProjects
                                    ]
                                )

                _ ->
                    ( model, Cmd.none )

        OpenRomeSearch professionalProjectIndex ->
            let
                ss =
                    Select.initState (Select.selectIdentifier ("RomeSelector" ++ String.fromInt professionalProjectIndex))

                -- Because it's being used as a dropdown we want a fresh state
                -- every time an action is clicked.
                ( _, focusedSelectState, cmds ) =
                    -- Focusing the select. Using the Select Cmd
                    -- ensures the menu is open on focus which is what you probably want
                    -- for a dropdown menu.
                    Select.update Select.focus ss

                newProfessionalProjects =
                    model.professionalProjects
                        |> List.Extra.updateAt professionalProjectIndex
                            (\professionalProjectState ->
                                { professionalProjectState | selectState = focusedSelectState }
                            )
            in
            case model.activeRomeSearchIndex of
                Just _ ->
                    ( { model | activeRomeSearchIndex = Nothing }, Cmd.none )

                _ ->
                    ( { model | professionalProjects = newProfessionalProjects, activeRomeSearchIndex = Just professionalProjectIndex }, Cmd.map (SelectMsg professionalProjectIndex) cmds )

        -- { model | ActiveRomeSearch = Just(professionalProjectIndex, selectState) }
        MsgFetchJobTitlesDebouncer subMsg ->
            Debouncer.update update fetchJobTitlesDebouncerConfig subMsg model

        FetchJobTitles index searchString ->
            if String.isEmpty searchString then
                ( { model
                    | professionalProjects =
                        model.professionalProjects
                            |> List.Extra.updateAt index (\project -> { project | romeData = NotAsked })
                  }
                , Cmd.none
                )

            else
                ( { model
                    | professionalProjects =
                        model.professionalProjects
                            |> List.Extra.updateAt index (\project -> { project | romeData = Loading })
                  }
                , getRome model.token model.serverUrl searchString index
                )

        JobTitlesFetched index result ->
            case result of
                Ok romeData ->
                    ( { model
                        | professionalProjects =
                            model.professionalProjects
                                |> List.Extra.updateAt index
                                    (\professionalProjectState ->
                                        { professionalProjectState | romeData = Success romeData }
                                    )
                      }
                    , Cmd.none
                    )

                Err _ ->
                    -- TODO: Que fait-on des erreurs http ?
                    ( model, Cmd.none )


getRome : String -> String -> String -> Int -> Cmd Msg
getRome token serverUrl searchString index =
    let
        query =
            """
            query searchRomes($searchString: String!) {
              rome: search_rome_codes(args: {search: $searchString}, limit: 50) {
                id
                label
              }
            }
            """
    in
    Http.request
        { method = "POST"
        , url = serverUrl
        , headers =
            [ Http.header "Authorization" ("Bearer " ++ token) ]
        , body =
            Http.jsonBody
                (Json.Encode.object
                    [ ( "query", Json.Encode.string query )
                    , ( "variables"
                      , Json.Encode.object
                            [ ( "searchString", Json.Encode.string searchString )
                            ]
                      )
                    ]
                )
        , expect = Http.expectJson (JobTitlesFetched index) romeListDecoder
        , timeout = Nothing
        , tracker = Nothing
        }


romeListDecoder : Json.Decode.Decoder (List Rome)
romeListDecoder =
    Json.Decode.at [ "data", "rome" ] (Json.Decode.list romeDecoder)


romeDecoder : Json.Decode.Decoder Rome
romeDecoder =
    Json.Decode.map2 Rome
        (Json.Decode.field "id" Json.Decode.string)
        (Json.Decode.field "label" Json.Decode.string)


situationsByTheme : List Situation -> List RefSituation
situationsByTheme situations =
    situations
        |> List.Extra.gatherEqualsBy .theme
        |> List.map (\( s, otherSituations ) -> { theme = s.theme, situations = s :: otherSituations, id = Nothing })
        |> List.sortBy (\{ theme } -> themeKeyTypeToLabel theme)



-- VIEW
-- TODO: Disable box-shadow on the select


selectedRomeToMenuItem : Rome -> Select.MenuItem Rome
selectedRomeToMenuItem rome =
    Select.basicMenuItem { item = rome, label = rome.label } |> Select.filterableMenuItem False


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
        , div []
            (model.professionalProjects
                |> List.indexedMap
                    (\index project ->
                        div [ class "fr-container shadow-dsfr rounded-lg pt-4 mt-4" ]
                            [ div [ class "fr-grid-row fr-grid-row--gutters" ]
                                [ div [ class "fr-col-8" ]
                                    [ div [ class "fr-input-group elm-select" ]
                                        [ label [ class "fr-label", for ("job" ++ String.fromInt index) ] [ text "Métier recherché" ]
                                        , button
                                            [ class "fr-select text-left"
                                            , type_ "button"
                                            , onClick (OpenRomeSearch index)
                                            ]
                                            [ Maybe.withDefault "Projet en construction" (Maybe.map .label project.selectedRome) |> text
                                            ]
                                        , case model.activeRomeSearchIndex of
                                            Just _ ->
                                                let
                                                    showloading =
                                                        case project.romeData of
                                                            Loading ->
                                                                Select.loading True

                                                            _ ->
                                                                Select.loading False
                                                in
                                                Html.map
                                                    (SelectMsg index)
                                                    (Styled.toUnstyled <|
                                                        Select.view
                                                            (Select.menu
                                                                |> Select.state project.selectState
                                                                |> Select.menuItems (romeDataToMenuItems project.romeData)
                                                                |> Select.placeholder "Recherchez un métier ou un code ROME"
                                                                |> Select.loadingMessage "Chargement..."
                                                                |> showloading
                                                            )
                                                    )

                                            _ ->
                                                text ""
                                        ]
                                    ]
                                , div [ class "fr-col-4" ]
                                    [ div [ class "fr-input-group" ]
                                        [ label
                                            [ class "fr-label", for ("mobility-radius" ++ String.fromInt index) ]
                                            [ text "Rayon de mobilité" ]
                                        , input
                                            [ class "fr-input"
                                            , onInput (UpdateMobilityRadius index)
                                            , type_ "text"
                                            , id ("mobility-radius" ++ String.fromInt index)
                                            , name "mobility-radius[]"
                                            , value (Maybe.map String.fromInt project.mobilityRadius |> Maybe.withDefault "")
                                            , inputmode "numeric"
                                            ]
                                            []
                                        ]
                                    ]
                                ]
                            , p [ class "py-4" ]
                                [ button
                                    [ class "fr-btn fr-btn--secondary", type_ "button", onClick (RemoveProject index) ]
                                    [ text "Supprimer" ]
                                ]
                            ]
                    )
            )
        , button [ class "fr-btn", type_ "button", onClick AddEmptyProfessionalProject ] [ text "Ajouter un projet professionnel" ]
        , h2
            [ class "text-france-blue pt-12" ]
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


port sendUpdatedProfessionalProjects : List ProfessionalProjectOut -> Cmd msg
