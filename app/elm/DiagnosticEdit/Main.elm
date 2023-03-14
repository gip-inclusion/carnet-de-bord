port module DiagnosticEdit.Main exposing (..)

import Browser
import Debouncer.Messages as Debouncer exposing (debounce, fromSeconds, provideInput, toDebouncer)
import Diagnostic.Main exposing (ProfessionalProjectFlags, addMoneyUnit, extractProfessionalProjectFromFlags)
import Domain.ProfessionalProject exposing (ContractType(..), ProfessionalProject, Rome, WorkingTime(..), contractTypeStringToType, contractTypeToKey, contractTypeToLabel, workingTimeStringToType, workingTimeToKey, workingTimeToLabel)
import Domain.Situation exposing (Situation)
import Domain.Theme exposing (Theme(..), themeKeyStringToType, themeKeyTypeToLabel)
import Html exposing (..)
import Html.Attributes exposing (..)
import Html.Events exposing (..)
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
    , hourlyRate : Maybe String
    , contractType : Maybe ContractType
    , workingTime : Maybe WorkingTime
    , romeData : RomeData
    , selectedRome : Maybe Rome
    , selectState : Select.State
    }


type alias ProfessionalProjectOut =
    { id : Maybe String
    , mobilityRadius : Maybe Int
    , romeCodeId : Maybe String
    , hourlyRate : Maybe Int
    , contractTypeId : Maybe String
    , employmentTypeId : Maybe String
    }


toProfessionalProjectOut : ProfessionalProjectState -> ProfessionalProjectOut
toProfessionalProjectOut state =
    { id = state.id
    , mobilityRadius = state.mobilityRadius
    , romeCodeId = Maybe.map .id state.selectedRome
    , hourlyRate =
        state.hourlyRate
            |> parseHourlyRate
            |> Maybe.map ((\val -> val * 100) >> truncate)
    , contractTypeId = Maybe.map contractTypeToKey state.contractType
    , employmentTypeId = Maybe.map workingTimeToKey state.workingTime
    }


parseHourlyRate : Maybe String -> Maybe Float
parseHourlyRate hourlyRate =
    hourlyRate
        |> Maybe.map (String.replace "," ".")
        |> Maybe.andThen String.toFloat


inputmode : String -> Attribute msg
inputmode name =
    attribute "inputmode" name


ariaExpanded : Bool -> Attribute Msg
ariaExpanded value =
    attribute "aria-expanded"
        (if value then
            "true"

         else
            "false"
        )


ariaDescribedBy : String -> Attribute msg
ariaDescribedBy value =
    attribute "aria-described-by" value


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
    | UpdateWorkingTime Int (Maybe WorkingTime)
    | UpdateContractType Int (Maybe ContractType)
    | UpdateHourlyRate Int String
    | OpenRomeSearch Int
    | SelectMsg Int (Select.Msg Rome)
    | MsgFetchJobTitlesDebouncer (Debouncer.Msg Msg)
    | FetchJobTitles Int String
    | JobTitlesFetched Int (Result Http.Error (List Rome))


professionalProjetsMaxCount : Int
professionalProjetsMaxCount =
    5


smicHourlyValue : Float
smicHourlyValue =
    11.27


inputIsLowerThanSmic : String -> Bool
inputIsLowerThanSmic input =
    case String.toFloat input of
        Just value ->
            if value < smicHourlyValue then
                True

            else
                False

        _ ->
            False



-- MODEL


type alias Model =
    { possibleSituationsByTheme : List RefSituation
    , selectedSituationSet : Set String
    , professionalProjects : List ProfessionalProjectState
    , token : String
    , serverUrl : String
    , fetchJobTitlesDebouncer : Debouncer.Debouncer Msg
    , activeRomeSearchIndex : Maybe Int
    , professionalProjectsMaxCountReached : Bool
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
    , hourlyRate = Maybe.map String.fromFloat professionalProject.hourlyRate
    , contractType = professionalProject.contractType
    , workingTime = professionalProject.workingTimeType
    , romeData = Maybe.withDefault NotAsked (Maybe.map (\value -> Success [ value ]) professionalProject.rome)
    , selectedRome = professionalProject.rome
    , selectState = Select.initState (Select.selectIdentifier ("RomeSelector" ++ professionalProject.id))
    }


hasReachedProfessionalProjectMaxCount : List a -> Bool
hasReachedProfessionalProjectMaxCount list =
    (list |> List.length) >= professionalProjetsMaxCount



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
      , professionalProjectsMaxCountReached = flags.professionalProjects |> hasReachedProfessionalProjectMaxCount
      }
    , Cmd.none
    )


romeSelectorKey : String
romeSelectorKey =
    "RomeSelector"



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
                                     , hourlyRate = Nothing
                                     , workingTime = Nothing
                                     , contractType = Nothing
                                     , selectState = Select.initState (Select.selectIdentifier (romeSelectorKey ++ String.fromInt (List.length model.professionalProjects)))
                                     }
                                   ]
                    }
            in
            ( { newModel
                | professionalProjectsMaxCountReached =
                    newModel.professionalProjects |> hasReachedProfessionalProjectMaxCount
              }
            , newModel.professionalProjects
                |> List.map toProfessionalProjectOut
                |> sendUpdatedProfessionalProjects
            )

        UpdateContractType indexToUpdate contract ->
            let
                newModel =
                    { model
                        | professionalProjects =
                            model.professionalProjects
                                |> List.Extra.updateAt indexToUpdate
                                    (\professionalProjectState ->
                                        { professionalProjectState | contractType = contract }
                                    )
                    }
            in
            ( newModel
            , newModel.professionalProjects
                |> List.map toProfessionalProjectOut
                |> sendUpdatedProfessionalProjects
            )

        UpdateHourlyRate indexToUpdate rate ->
            let
                newModel =
                    { model
                        | professionalProjects =
                            model.professionalProjects
                                |> List.Extra.updateAt indexToUpdate
                                    (\professionalProjectState ->
                                        { professionalProjectState | hourlyRate = Just rate }
                                    )
                    }
            in
            ( newModel
            , newModel.professionalProjects
                |> List.map toProfessionalProjectOut
                |> sendUpdatedProfessionalProjects
            )

        UpdateWorkingTime indexToUpdate workingTime ->
            let
                newModel =
                    { model
                        | professionalProjects =
                            model.professionalProjects
                                |> List.Extra.updateAt indexToUpdate
                                    (\professionalProjectState ->
                                        { professionalProjectState | workingTime = workingTime }
                                    )
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
                        , professionalProjectsMaxCountReached = False
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
                            let
                                newProfessionalProject =
                                    newModel.professionalProjects
                                        |> List.Extra.updateAt indexToUpdate
                                            (\professionalProjectState ->
                                                { professionalProjectState | selectedRome = Just someRome }
                                            )
                            in
                            ( { newModel
                                | professionalProjects = newProfessionalProject
                                , activeRomeSearchIndex = Nothing
                              }
                            , Cmd.batch
                                [ newCmds
                                , newProfessionalProject
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
            [ text "Projet(s) professionnel(s)" ]
        , div []
            (model.professionalProjects
                |> List.indexedMap
                    (\index project ->
                        div [ class "fr-container shadow-dsfr rounded-lg pt-4 mt-4" ]
                            [ div [ class "fr-input-group elm-select" ]
                                [ label [ class "fr-label", for ("job" ++ String.fromInt index) ] [ text "Métier recherché" ]
                                , button
                                    [ class "fr-select text-left"
                                    , type_ "button"
                                    , onClick (OpenRomeSearch index)
                                    , ariaExpanded (Select.isMenuOpen project.selectState)
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
                                        div []
                                            [ Html.map
                                                (SelectMsg index)
                                                (Styled.toUnstyled <|
                                                    Select.view
                                                        (Select.menu
                                                            |> Select.state project.selectState
                                                            |> Select.menuItems (romeDataToMenuItems project.romeData)
                                                            |> Select.placeholder "Rechercher un métier ou un code ROME"
                                                            |> Select.loadingMessage "Chargement..."
                                                            |> Select.ariaDescribedBy ("select-usage-" ++ String.fromInt index)
                                                            |> showloading
                                                        )
                                                )
                                            , if project.selectState |> Select.isMenuOpen then
                                                p [ class "sr-only", id ("select-usage-" ++ String.fromInt index) ] [ text "Utilisez les touches flèches pour naviguer dans la liste des suggestions" ]

                                              else
                                                text ""
                                            , if project.selectState |> Select.isMenuOpen then
                                                label [ class "sr-only", for (romeSelectorKey ++ String.fromInt index ++ "__elm-select") ] [ text "Rechercher un métier ou un code ROME" ]

                                              else
                                                text ""
                                            ]

                                    _ ->
                                        text ""
                                ]
                            , div
                                [ class "fr-grid-row fr-grid-row--gutters " ]
                                [ div [ class "fr-col-4" ]
                                    [ div [ class "fr-input-group" ]
                                        [ label
                                            [ class "fr-label", for ("contractType" ++ String.fromInt index) ]
                                            [ text "Type de contrat" ]
                                        , select
                                            [ class "fr-select"
                                            , id ("contract-type-" ++ String.fromInt index)
                                            , name ("contract-type-" ++ String.fromInt index)
                                            , onInput (\val -> UpdateContractType index (contractTypeStringToType val))
                                            ]
                                            [ option [ value "", disabled True, selected (project.contractType == Nothing) ] [ text "Sélectionner un type de contrat" ]
                                            , contractTypeOption CDI project.contractType
                                            , contractTypeOption CDD project.contractType
                                            , contractTypeOption Interim project.contractType
                                            , contractTypeOption Seasonal project.contractType
                                            , contractTypeOption Liberal project.contractType
                                            , contractTypeOption Professionalization project.contractType
                                            , contractTypeOption Apprenticeship project.contractType
                                            , contractTypeOption Portage project.contractType
                                            ]
                                        ]
                                    ]
                                , div
                                    [ class "fr-col-4" ]
                                    [ div [ class "fr-input-group" ]
                                        [ label
                                            [ class "fr-label", for ("contractType" ++ String.fromInt index) ]
                                            [ text "Durée du temps de travail" ]
                                        , select
                                            [ class "fr-select"
                                            , id ("working-type-" ++ String.fromInt index)
                                            , name ("working-type" ++ String.fromInt index)
                                            , onInput (\val -> UpdateWorkingTime index (workingTimeStringToType val))
                                            ]
                                            [ option [ value "", disabled True, selected (project.workingTime == Nothing) ] [ text "Sélectionner une durée de temps de travail" ]
                                            , workingTimeTypeOption FullTime project.workingTime
                                            , workingTimeTypeOption PartTime project.workingTime
                                            ]
                                        ]
                                    ]
                                , div [ class "fr-col-4" ]
                                    [ div [ class "fr-input-group" ]
                                        [ label
                                            [ class "fr-label", for ("mobility-radius" ++ String.fromInt index) ]
                                            [ text "Zone de mobilité (km)" ]
                                        , input
                                            [ class "fr-input"
                                            , onInput (UpdateMobilityRadius index)
                                            , type_ "text"
                                            , id ("mobility-radius-" ++ String.fromInt index)
                                            , name ("mobility-radius-" ++ String.fromInt index)
                                            , value (Maybe.map String.fromInt project.mobilityRadius |> Maybe.withDefault "")
                                            , inputmode "numeric"
                                            ]
                                            []
                                        ]
                                    ]
                                , div [ class "fr-col-4" ]
                                    [ let
                                        showSmicNotice =
                                            case project.hourlyRate of
                                                Just value ->
                                                    inputIsLowerThanSmic value

                                                Nothing ->
                                                    False

                                        showInvalidValue =
                                            case ( project.hourlyRate, project.hourlyRate |> parseHourlyRate ) of
                                                ( Just "", _ ) ->
                                                    False

                                                ( Just _, Nothing ) ->
                                                    True

                                                _ ->
                                                    False

                                        attrlist =
                                            [ case ( showInvalidValue, showSmicNotice ) of
                                                ( True, _ ) ->
                                                    ariaDescribedBy ("hourlyRateErrorMessage" ++ String.fromInt index)

                                                ( False, True ) ->
                                                    ariaDescribedBy ("smicNotice" ++ String.fromInt index)

                                                _ ->
                                                    classList []
                                            , class "fr-input"
                                            , for ("hourlyRate" ++ String.fromInt index)
                                            ]
                                      in
                                      div [ class "fr-input-group" ]
                                        [ label
                                            [ class "fr-label" ]
                                            [ text "Salaire minimum brut horaire (€)"
                                            , span [ class "fr-hint-text" ] [ text ("SMIC horaire brut au 1er janvier 2023 : " ++ String.fromFloat smicHourlyValue |> addMoneyUnit) ]
                                            ]
                                        , input
                                            (List.append
                                                attrlist
                                                [ type_ "text"
                                                , id ("hourly-rate-" ++ String.fromInt index)
                                                , name ("hourly-rate-" ++ String.fromInt index)
                                                , onInput (UpdateHourlyRate index)
                                                , value (Maybe.withDefault "" project.hourlyRate)
                                                , inputmode "numeric"
                                                ]
                                            )
                                            []
                                        , if showSmicNotice then
                                            p [ id ("smicNotice" ++ String.fromInt index), class "fr-error-text" ] [ text "Attention, la valeur est inférieure au SMIC." ]

                                          else
                                            text ""
                                        , if showInvalidValue then
                                            p [ id ("hourlyRateErrorMessage" ++ String.fromInt index), class "fr-error-text" ] [ text "Attention, la valeur doit être un nombre." ]

                                          else
                                            text ""
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
        , button
            [ class "fr-btn fr-btn--secondary"
            , type_ "button"
            , onClick AddEmptyProfessionalProject
            , disabled model.professionalProjectsMaxCountReached
            ]
            [ text "Ajouter un projet professionnel" ]
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


contractTypeOption : ContractType -> Maybe ContractType -> Html Msg
contractTypeOption contractType selectedContractType =
    option
        [ value <| contractTypeToLabel contractType
        , selected (Just contractType == selectedContractType)
        ]
        [ text <| contractTypeToLabel contractType ]


workingTimeTypeOption : WorkingTime -> Maybe WorkingTime -> Html Msg
workingTimeTypeOption workingTimeType selectedworkingTimeType =
    option
        [ value <| workingTimeToLabel workingTimeType
        , selected (Just workingTimeType == selectedworkingTimeType)
        ]
        [ text <| workingTimeToLabel workingTimeType ]


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
