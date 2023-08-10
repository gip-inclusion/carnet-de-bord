port module DiagnosticEdit.Main exposing
    ( Flags
    , Model
    , Msg(..)
    , NotebookSituationFlag
    , ProfessionalProjectOut
    , ProfessionalProjectState
    , RefSituationFlag
    , Theme
    , main
    )

import Browser
import Decimal exposing (Decimal)
import Diagnostic.ProfessionalProject
import DiagnosticEdit.RomeSelect
import Domain.ProfessionalProject
    exposing
        ( ContractType(..)
        , ProfessionalProject
        , WorkingTime(..)
        , contractTypeStringToType
        , contractTypeToKey
        , contractTypeToLabel
        , workingTimeStringToType
        , workingTimeToKey
        , workingTimeToLabel
        )
import Domain.RefTheme as RefTheme exposing (RefTheme)
import Domain.Situation exposing (Situation)
import Html
import Html.Attributes as Attr
import Html.Events as Evts
import List.Extra
import Set exposing (Set)



-- PORTS


port sendSelectedSituations : List String -> Cmd msg


port sendUpdatedProfessionalProjects : List ProfessionalProjectOut -> Cmd msg


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
    , professionalProjects : List Diagnostic.ProfessionalProject.ProjectFlag
    }


parseHourlyRate : Maybe String -> Maybe Decimal
parseHourlyRate hourlyRate =
    hourlyRate
        |> Maybe.map (String.replace "," ".")
        |> Maybe.andThen Decimal.fromString


inputmode : String -> Html.Attribute msg
inputmode name =
    Attr.attribute "inputmode" name


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


type alias Theme =
    { theme : RefTheme
    , situations : List Situation
    , id : Maybe String
    }


professionalProjetsMaxCount : Int
professionalProjetsMaxCount =
    5


smicHourlyValue : Decimal
smicHourlyValue =
    Decimal.fromIntWithExponent 1152 -2


inputIsLowerThanSmic : String -> Bool
inputIsLowerThanSmic input =
    case parseHourlyRate (Just input) of
        Just value ->
            Decimal.lt value smicHourlyValue

        _ ->
            False



-- MODEL


type alias Model =
    { themes : List Theme
    , selectedSituationSet : Set String
    , professionalProjects : List ProfessionalProjectState
    , professionalProjectsMaxCountReached : Bool
    }


type alias ProfessionalProjectState =
    { id : Maybe String
    , mobilityRadius : Maybe Int
    , hourlyRate : Maybe String
    , contractType : Maybe ContractType
    , workingTime : Maybe WorkingTime
    , romeSelect : DiagnosticEdit.RomeSelect.Model
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
    , romeCodeId =
        state.romeSelect
            |> DiagnosticEdit.RomeSelect.getSelected
            |> Maybe.map .id
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


extractProfessionalProjectsFromFlags : List Diagnostic.ProfessionalProject.ProjectFlag -> List ProfessionalProject
extractProfessionalProjectsFromFlags professionalProjects =
    List.map Diagnostic.ProfessionalProject.extractProfessionalProjectFromFlags professionalProjects


initProfessionalProjectState : ProfessionalProject -> ProfessionalProjectState
initProfessionalProjectState professionalProject =
    { id = Just professionalProject.id
    , mobilityRadius = professionalProject.mobilityRadius
    , hourlyRate = Maybe.map Decimal.toString professionalProject.hourlyRate
    , contractType = professionalProject.contractType
    , workingTime = professionalProject.workingTimeType
    , romeSelect =
        DiagnosticEdit.RomeSelect.init
            { id = professionalProject.id
            , selected = professionalProject.rome
            , errorLog = always Cmd.none -- TODO envoyer sur Sentry
            }
    }


hasReachedProfessionalProjectMaxCount : List a -> Bool
hasReachedProfessionalProjectMaxCount list =
    (list |> List.length) >= professionalProjetsMaxCount



-- INIT


init : Flags -> ( Model, Cmd msg )
init flags =
    ( { themes = flags |> parseSituations |> groupByTheme
      , selectedSituationSet =
            flags.situations
                |> List.map .refSituation
                |> List.map .id
                |> Set.fromList
      , professionalProjects =
            extractProfessionalProjectsFromFlags flags.professionalProjects
                |> List.map initProfessionalProjectState
      , professionalProjectsMaxCountReached = flags.professionalProjects |> hasReachedProfessionalProjectMaxCount
      }
    , Cmd.none
    )


parseSituations : Flags -> List Situation
parseSituations flags =
    List.filterMap parseSituation flags.refSituations


parseSituation : RefSituationFlag -> Maybe Situation
parseSituation flag =
    flag.theme
        |> RefTheme.parse
        |> Maybe.map
            (\theme ->
                { id = flag.id
                , description = flag.description
                , theme = theme
                }
            )



-- UPDATE


type Msg
    = ToggleSelectedSituation Situation
    | AddEmptyProfessionalProject
    | RemoveProject Int
    | UpdateMobilityRadius Int String
    | UpdateWorkingTime Int (Maybe WorkingTime)
    | UpdateContractType Int (Maybe ContractType)
    | UpdateHourlyRate Int String
    | RomeSelectMsg Int DiagnosticEdit.RomeSelect.Msg


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
                                     , mobilityRadius = Nothing
                                     , hourlyRate = Nothing
                                     , workingTime = Nothing
                                     , contractType = Nothing
                                     , romeSelect =
                                        DiagnosticEdit.RomeSelect.init
                                            { id = String.fromInt (List.length model.professionalProjects)
                                            , selected = Nothing
                                            , errorLog = always Cmd.none -- TODO envoyer sur Sentry
                                            }
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

        RomeSelectMsg projectIndex subMsg ->
            case List.Extra.getAt projectIndex model.professionalProjects of
                Just project ->
                    let
                        ( nextSelect, command ) =
                            DiagnosticEdit.RomeSelect.update subMsg project.romeSelect

                        nextModel =
                            { project | romeSelect = nextSelect }
                                |> updateProject projectIndex model
                    in
                    ( nextModel
                    , Cmd.batch
                        [ command |> Cmd.map (RomeSelectMsg projectIndex)
                        , nextModel.professionalProjects
                            |> List.map toProfessionalProjectOut
                            |> sendUpdatedProfessionalProjects
                        ]
                    )

                Nothing ->
                    ( model, Cmd.none )


updateProject : Int -> Model -> ProfessionalProjectState -> Model
updateProject index model project =
    { model
        | professionalProjects =
            List.Extra.setAt index
                project
                model.professionalProjects
    }


groupByTheme : List Situation -> List Theme
groupByTheme situations =
    situations
        |> List.Extra.gatherEqualsBy .theme
        |> List.map
            (\( first, rest ) ->
                { theme = first.theme
                , situations = first :: rest |> List.sortBy .description
                , id = Nothing
                }
            )
        |> List.sortBy (\{ theme } -> RefTheme.print theme)



-- VIEW


view : Model -> Html.Html Msg
view model =
    Html.div [ Attr.class "pt-12" ]
        [ Html.h2
            [ Attr.class "text-vert-cdb" ]
            [ Html.text "Projet(s) professionnel(s)" ]
        , Html.div [] (model.professionalProjects |> List.indexedMap viewProfessionalProject)
        , Html.button
            [ Attr.class "fr-btn fr-btn--secondary"
            , Attr.type_ "button"
            , Evts.onClick AddEmptyProfessionalProject
            , Attr.disabled model.professionalProjectsMaxCountReached
            ]
            [ Html.text "Ajouter un projet professionnel" ]
        , Html.h2
            [ Attr.class "text-vert-cdb pt-12" ]
            [ Html.text "Situation Personnelle" ]
        , Html.div [] (model.themes |> List.map (viewSituationTheme model))
        ]


viewProfessionalProject : Int -> ProfessionalProjectState -> Html.Html Msg
viewProfessionalProject index project =
    Html.div [ Attr.class "fr-container shadow-dsfr rounded-lg pt-4 mt-4" ]
        [ DiagnosticEdit.RomeSelect.view project.romeSelect
            |> Html.map (RomeSelectMsg index)
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
                        , Html.span [ Attr.class "fr-hint-text" ]
                            [ Html.text
                                ("SMIC horaire brut au 1er janvier 2023 : "
                                    ++ Diagnostic.ProfessionalProject.printEuros smicHourlyValue
                                )
                            ]
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


viewSituationTheme : Model -> (Theme -> Html.Html Msg)
viewSituationTheme model { theme, situations } =
    Html.div [ Attr.class "fr-form-group pl-0 pb-8 border-b" ]
        [ Html.fieldset [ Attr.class "fr-fieldset" ]
            [ Html.legend [ Attr.class "fr-fieldset__legend fr-text-bold" ] [ Html.text <| RefTheme.print theme ]
            , Html.div [ Attr.class "fr-fieldset__content" ]
                [ Html.div [ Attr.class "fr-grid-row fr-grid-row--gutters" ]
                    (List.map
                        (situationCheckboxView model.selectedSituationSet)
                        situations
                    )
                ]
            ]
        ]


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
