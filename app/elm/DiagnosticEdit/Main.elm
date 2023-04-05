port module DiagnosticEdit.Main exposing (Flags, Model, Msg(..), NotebookSituationFlag, ProfessionalProjectOut, ProfessionalProjectState, RefSituation, RefSituationFlag, RomeData(..), SelectedSituation, main)

import Browser
import Debouncer.Messages as Debouncer exposing (debounce, fromSeconds, provideInput, toDebouncer)
import Decimal exposing (Decimal)
import Diagnostic.Main exposing (ProfessionalProjectFlags, addMoneyUnit, extractProfessionalProjectFromFlags)
import Domain.ProfessionalProject exposing (ContractType(..), ProfessionalProject, Rome, WorkingTime(..), contractTypeStringToType, contractTypeToKey, contractTypeToLabel, workingTimeStringToType, workingTimeToKey, workingTimeToLabel)
import Domain.Situation exposing (Situation)
import Domain.Theme exposing (Theme, themeKeyStringToType, themeKeyTypeToLabel)
import Html
import Html.Attributes as Attr
import Html.Events as Evts
import Html.Styled as Styled
import Http
import Json.Decode as Decode
import Json.Encode as Json
import List.Extra
import Select
import Set exposing (Set)


type RomeData
    = Loading
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
            |> Maybe.map (Decimal.fromInt 100 |> Decimal.mul)
            |> Maybe.map (Decimal.truncate 0)
            |> Maybe.map Decimal.toString
            |> Maybe.andThen String.toInt
    , contractTypeId = Maybe.map contractTypeToKey state.contractType
    , employmentTypeId = Maybe.map workingTimeToKey state.workingTime
    }


parseHourlyRate : Maybe String -> Maybe Decimal
parseHourlyRate hourlyRate =
    hourlyRate
        |> Maybe.map (String.replace "," ".")
        |> Maybe.andThen Decimal.fromString


inputmode : String -> Html.Attribute msg
inputmode name =
    Attr.attribute "inputmode" name


ariaExpanded : Bool -> Html.Attribute Msg
ariaExpanded value =
    Attr.attribute "aria-expanded"
        (if value then
            "true"

         else
            "false"
        )


ariaDescribedBy : String -> Html.Attribute msg
ariaDescribedBy value =
    Attr.attribute "aria-described-by" value


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


smicHourlyValue : Decimal
smicHourlyValue =
    Decimal.fromIntWithExponent 1127 -2


inputIsLowerThanSmic : String -> Bool
inputIsLowerThanSmic input =
    case parseHourlyRate (Just input) of
        Just value ->
            Decimal.lt value smicHourlyValue

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
    , hourlyRate = Maybe.map Decimal.toString professionalProject.hourlyRate
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
            case model.activeRomeSearchIndex of
                Just _ ->
                    ( { model | activeRomeSearchIndex = Nothing }, Cmd.none )

                _ ->
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
                    ( { model
                        | professionalProjects = newProfessionalProjects
                        , activeRomeSearchIndex = Just professionalProjectIndex
                      }
                    , Cmd.map (SelectMsg professionalProjectIndex) cmds
                    )

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
                (Json.object
                    [ ( "query", Json.string query )
                    , ( "variables"
                      , Json.object
                            [ ( "searchString", Json.string searchString )
                            ]
                      )
                    ]
                )
        , expect = Http.expectJson (JobTitlesFetched index) romeListDecoder
        , timeout = Nothing
        , tracker = Nothing
        }


romeListDecoder : Decode.Decoder (List Rome)
romeListDecoder =
    Decode.at [ "data", "rome" ] (Decode.list romeDecoder)


romeDecoder : Decode.Decoder Rome
romeDecoder =
    Decode.map2 Rome
        (Decode.field "id" Decode.string)
        (Decode.field "label" Decode.string)


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


view : Model -> Html.Html Msg
view model =
    Html.div [ Attr.class "pt-12" ]
        [ Html.h2
            [ Attr.class "text-france-blue" ]
            [ Html.text "Projet(s) professionnel(s)" ]
        , Html.div []
            (model.professionalProjects
                |> List.indexedMap
                    (\index project ->
                        Html.div [ Attr.class "fr-container shadow-dsfr rounded-lg pt-4 mt-4" ]
                            [ Html.div [ Attr.class "fr-input-group elm-select" ]
                                [ Html.span [ Attr.class "fr-label" ] [ Html.text "Métier recherché" ]
                                , Html.button
                                    [ Attr.class "fr-select text-left"
                                    , Attr.type_ "button"
                                    , Evts.onClick (OpenRomeSearch index)
                                    , ariaExpanded (Select.isMenuOpen project.selectState)
                                    ]
                                    [ Maybe.withDefault "Projet en construction" (Maybe.map .label project.selectedRome) |> Html.text
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
                                        Html.div []
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
                                                Html.p
                                                    [ Attr.class "sr-only"
                                                    , Attr.id ("select-usage-" ++ String.fromInt index)
                                                    ]
                                                    [ Html.text "Utilisez les touches flèches pour naviguer dans la liste des suggestions"
                                                    ]

                                              else
                                                Html.text ""
                                            , if project.selectState |> Select.isMenuOpen then
                                                Html.label [ Attr.class "sr-only", Attr.for (romeSelectorKey ++ String.fromInt index ++ "__elm-select") ] [ Html.text "Rechercher un métier ou un code ROME" ]

                                              else
                                                Html.text ""
                                            ]

                                    _ ->
                                        Html.text ""
                                ]
                            , Html.div
                                [ Attr.class "fr-grid-row fr-grid-row--gutters " ]
                                [ Html.div [ Attr.class "fr-col-4" ]
                                    [ Html.div [ Attr.class "fr-input-group" ]
                                        [ Html.label
                                            [ Attr.class "fr-label", Attr.for ("contract-type-" ++ String.fromInt index) ]
                                            [ Html.text "Type de contrat" ]
                                        , Html.select
                                            [ Attr.class "fr-select"
                                            , Attr.id ("contract-type-" ++ String.fromInt index)
                                            , Evts.onInput (\val -> UpdateContractType index (contractTypeStringToType val))
                                            ]
                                            [ Html.option [ Attr.value "" ] [ Html.text "Non renseigné" ]
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
                                , Html.div
                                    [ Attr.class "fr-col-4" ]
                                    [ Html.div [ Attr.class "fr-input-group" ]
                                        [ Html.label
                                            [ Attr.class "fr-label", Attr.for ("working-type-" ++ String.fromInt index) ]
                                            [ Html.text "Durée du temps de travail" ]
                                        , Html.select
                                            [ Attr.class "fr-select"
                                            , Attr.id ("working-type-" ++ String.fromInt index)
                                            , Evts.onInput (\val -> UpdateWorkingTime index (workingTimeStringToType val))
                                            ]
                                            [ Html.option [ Attr.value "" ] [ Html.text "Non renseigné" ]
                                            , workingTimeTypeOption FullTime project.workingTime
                                            , workingTimeTypeOption PartTime project.workingTime
                                            ]
                                        ]
                                    ]
                                , Html.div [ Attr.class "fr-col-4" ]
                                    [ Html.div [ Attr.class "fr-input-group" ]
                                        [ Html.label
                                            [ Attr.class "fr-label", Attr.for ("mobility-radius-" ++ String.fromInt index) ]
                                            [ Html.text "Zone de mobilité (km)" ]
                                        , Html.input
                                            [ Attr.class "fr-input"
                                            , Evts.onInput (UpdateMobilityRadius index)
                                            , Attr.type_ "text"
                                            , Attr.id ("mobility-radius-" ++ String.fromInt index)
                                            , Attr.value (Maybe.map String.fromInt project.mobilityRadius |> Maybe.withDefault "")
                                            , inputmode "numeric"
                                            ]
                                            []
                                        ]
                                    ]
                                , Html.div [ Attr.class "fr-col-4" ]
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
                                                    Attr.classList []
                                            , Attr.class "fr-input"
                                            ]
                                      in
                                      Html.div [ Attr.class "fr-input-group" ]
                                        [ Html.label
                                            [ Attr.class "fr-label", Attr.for ("hourly-rate-" ++ String.fromInt index) ]
                                            [ Html.text "Salaire minimum brut horaire (€)"
                                            , Html.span [ Attr.class "fr-hint-text" ] [ Html.text ("SMIC horaire brut au 1er janvier 2023 : " ++ Decimal.toString smicHourlyValue |> addMoneyUnit) ]
                                            ]
                                        , Html.input
                                            (attrlist
                                                ++ [ Attr.type_ "text"
                                                   , Attr.id ("hourly-rate-" ++ String.fromInt index)
                                                   , Evts.onInput (UpdateHourlyRate index)
                                                   , Attr.value (Maybe.withDefault "" project.hourlyRate)
                                                   , inputmode "numeric"
                                                   ]
                                            )
                                            []
                                        , if showSmicNotice then
                                            Html.p [ Attr.id ("smicNotice" ++ String.fromInt index), Attr.class "fr-error-text" ] [ Html.text "Attention, la valeur est inférieure au SMIC." ]

                                          else
                                            Html.text ""
                                        , if showInvalidValue then
                                            Html.p [ Attr.id ("hourlyRateErrorMessage" ++ String.fromInt index), Attr.class "fr-error-text" ] [ Html.text "Attention, la valeur doit être un nombre." ]

                                          else
                                            Html.text ""
                                        ]
                                    ]
                                ]
                            , Html.p [ Attr.class "py-4" ]
                                [ Html.button
                                    [ Attr.class "fr-btn fr-btn--secondary", Attr.type_ "button", Evts.onClick (RemoveProject index) ]
                                    [ Html.text "Supprimer" ]
                                ]
                            ]
                    )
            )
        , Html.button
            [ Attr.class "fr-btn fr-btn--secondary"
            , Attr.type_ "button"
            , Evts.onClick AddEmptyProfessionalProject
            , Attr.disabled model.professionalProjectsMaxCountReached
            ]
            [ Html.text "Ajouter un projet professionnel" ]
        , Html.h2
            [ Attr.class "text-france-blue pt-12" ]
            [ Html.text "Situation Personnelle" ]
        , Html.div []
            (model.possibleSituationsByTheme
                |> List.map
                    (\{ theme, situations } ->
                        Html.div [ Attr.class "fr-form-group pl-0 pb-8 border-b" ]
                            [ Html.fieldset [ Attr.class "fr-fieldset" ]
                                [ Html.legend [ Attr.class "fr-fieldset__legend fr-text-bold" ] [ Html.text <| themeKeyTypeToLabel theme ]
                                , Html.div [ Attr.class "fr-fieldset__content" ]
                                    [ Html.div [ Attr.class "fr-grid-row fr-grid-row--gutters" ]
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


contractTypeOption : ContractType -> Maybe ContractType -> Html.Html Msg
contractTypeOption contractType selectedContractType =
    Html.option
        [ Attr.value <| contractTypeToLabel contractType
        , Attr.selected (Just contractType == selectedContractType)
        ]
        [ Html.text <| contractTypeToLabel contractType ]


workingTimeTypeOption : WorkingTime -> Maybe WorkingTime -> Html.Html Msg
workingTimeTypeOption workingTimeType selectedworkingTimeType =
    Html.option
        [ Attr.value <| workingTimeToLabel workingTimeType
        , Attr.selected (Just workingTimeType == selectedworkingTimeType)
        ]
        [ Html.text <| workingTimeToLabel workingTimeType ]


situationCheckboxView : Set String -> Situation -> Html.Html Msg
situationCheckboxView selectedSituationSet situation =
    let
        checkboxId =
            "checkbox-radio-group" ++ situation.description
    in
    Html.div [ Attr.class "fr-col-sm-12 fr-col-md-6 fr-col-lg-4 fr-col-xl-4 fr-checkbox-group !mt-0" ]
        [ Html.input
            [ Attr.type_ "checkbox"
            , Attr.id checkboxId
            , Attr.value situation.description
            , Attr.checked <| Set.member situation.id selectedSituationSet
            , Evts.onClick <| ToggleSelectedSituation { id = situation.id, description = situation.description, theme = situation.theme }
            ]
            []
        , Html.label [ Attr.class "fr-label", Attr.for checkboxId ] [ Html.text situation.description ]
        ]



-- PORTS


port sendSelectedSituations : List String -> Cmd msg


port sendUpdatedProfessionalProjects : List ProfessionalProjectOut -> Cmd msg
