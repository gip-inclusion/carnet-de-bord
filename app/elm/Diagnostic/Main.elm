module Diagnostic.Main exposing (..)

import Browser
import Date exposing (Date, fromIsoString)
import Domain.ProfessionalProject exposing (ProfessionalProject)
import Domain.SituationPro exposing (SituationPro, educationLevelKeyToString, geographicalAreaKeyToString, rsaRightKeyToString, workSituationKeyToString)
import Html exposing (..)
import Html.Attributes exposing (class)


type alias Flags =
    { workSituation : Maybe String
    , workSituationDate : Maybe String
    , workSituationEndDate : Maybe String
    , rightRqth : Bool
    , rightRsa : Maybe String
    , rightAre : Bool
    , rightAss : Bool
    , rightBonus : Bool
    , geographicalArea : Maybe String
    , educationLevel : Maybe String
    , wantedJobs : List String
    }


main : Program Flags Model Msg
main =
    Browser.element
        { init = init
        , view = view
        , update = update
        , subscriptions = subscriptions
        }



-- MODEL


type alias Model =
    { situationPro : SituationPro
    , professionalProjects : List ProfessionalProject
    }


init : Flags -> ( Model, Cmd Msg )
init flags =
    ( { situationPro = extractSituationFromFlags flags
      , professionalProjects = []
      }
    , Cmd.none
    )



-- UPDATE


type Msg
    = Recv String



-- Use the `sendMessage` port when someone presses ENTER or clicks
-- the "Send" button. Check out index.html to see the corresponding
-- JS where this is piped into a WebSocket.
--


update : Msg -> Model -> ( Model, Cmd Msg )
update msg model =
    case msg of
        Recv _ ->
            ( model, Cmd.none )



-- Subscribe to the `messageReceiver` port to hear about messages coming in
-- from JS. Check out the index.html file to see how this is hooked up to a
-- WebSocket.
--


subscriptions : Model -> Sub Msg
subscriptions _ =
    Sub.none



-- VIEW


view : Model -> Html Msg
view model =
    div []
        [ h2 [ class "text-france-blue text-2xl font-bold" ] [ text "Diagnostic socioprofessionnel" ]
        , div []
            [ professionalSituation model
            , professionalProject model
            ]
        ]


workSituationDateFormat : Maybe Date -> Maybe Date -> Maybe (Html msg)
workSituationDateFormat startDate endDate =
    let
        prettyDate : Date -> String -> String
        prettyDate date label =
            date
                |> Date.format "dd/MM/yyyy"
                |> String.append label
    in
    case ( startDate, endDate ) of
        ( Just start, Nothing ) ->
            Just (span [ class "text-sm" ] [ text (prettyDate start "Depuis le ") ])

        ( Nothing, Just end ) ->
            Just (span [ class "text-sm" ] [ text (prettyDate end "Jusqu'au ") ])

        ( Just start, Just end ) ->
            Just
                (span [ class "text-sm" ]
                    [ text (prettyDate start "Du " ++ prettyDate end " au ")
                    , span [ class "italic font-bold" ] [ text (" (" ++ (Date.diff Date.Months start end |> String.fromInt) ++ " mois)") ]
                    ]
                )

        _ ->
            Nothing


beneficiaryRights : Bool -> Bool -> Bool -> Html msg
beneficiaryRights are ass bonus =
    let
        rightValues =
            [ ( are, "ARE" )
            , ( ass, "ASS" )
            , ( bonus, "Prime d'activité" )
            ]
    in
    rightValues
        |> List.filter (\( has_right, _ ) -> has_right)
        |> List.map (\( _, right_label ) -> right_label)
        |> String.join ", "
        |> text


professionalSituation : Model -> Html Msg
professionalSituation model =
    let
        situationPro =
            model.situationPro
    in
    div [ class "fr-col-8" ]
        [ div [ class "fr-grid-row fr-grid-row--gutters" ]
            [ div [ class "fr-col-6" ]
                [ situationElement "Droits"
                    (Maybe.map (rsaRightKeyToString >> text) situationPro.rightRsa)
                    (Just
                        (beneficiaryRights situationPro.rightAre situationPro.rightAss situationPro.rightBonus)
                    )
                ]
            ]
        , h3 [ class "text-xl" ] [ text "Situation professionnelle" ]
        , div [ class "fr-grid-row fr-grid-row--gutters" ]
            [ div [ class "fr-col-6" ]
                [ situationElement "Situation actuelle"
                    (Maybe.map (workSituationKeyToString >> text) situationPro.workSituation)
                    (workSituationDateFormat situationPro.workSituationDate situationPro.workSituationEndDate)
                ]
            , div [ class "fr-col-6" ]
                [ div [ class "fr-col-6" ]
                    [ situationElement "Date du dernier emploi"
                        Nothing
                        Nothing
                    ]
                ]
            , div [ class "fr-col-6" ]
                [ div [ class "fr-col-6" ]
                    [ situationElement "Dispose d'un RQTH"
                        (Just
                            (if situationPro.rightRqth then
                                text "Oui"

                             else
                                text "Non"
                            )
                        )
                        Nothing
                    ]
                ]
            , div [ class "fr-col-6" ]
                [ situationElement "Diplôme"
                    (Maybe.map (educationLevelKeyToString >> text) situationPro.educationLevel)
                    Nothing
                ]
            ]
        ]


wantedJobsToHtml : List String -> Maybe (Html msg)
wantedJobsToHtml wantedJobs =
    case wantedJobs of
        [] ->
            Nothing

        jobs ->
            Just
                (ul []
                    (jobs
                        |> List.map (\job -> li [] [ text job ])
                    )
                )


professionalProject : Model -> Html Msg
professionalProject model =
    div [ class "fr-col-12" ]
        [ h3 [ class "text-xl" ] [ text "Projet professionnel" ]
        , div [ class "fr-grid-row fr-grid-row--gutters" ]
            [ div [ class "fr-col-8" ]
                [ situationElement "Emplois recherchés"
                    (wantedJobsToHtml model.situationPro.wantedJobs)
                    Nothing
                ]
            , div [ class "fr-col-4" ]
                [ situationElement "Zone de mobilité"
                    (Maybe.map (geographicalAreaKeyToString >> text) model.situationPro.geographicalArea)
                    Nothing
                ]
            ]
        ]


extractSituationFromFlags : Flags -> SituationPro
extractSituationFromFlags flags =
    { workSituation = flags.workSituation
    , workSituationDate =
        flags.workSituationDate
            |> Maybe.andThen (fromIsoString >> Result.toMaybe)
    , workSituationEndDate =
        flags.workSituationEndDate
            |> Maybe.andThen (fromIsoString >> Result.toMaybe)
    , rightRqth = flags.rightRqth
    , rightRsa = flags.rightRsa
    , rightAre = flags.rightAre
    , rightAss = flags.rightAss
    , rightBonus = flags.rightBonus
    , geographicalArea = flags.geographicalArea
    , educationLevel = flags.educationLevel
    , wantedJobs = flags.wantedJobs
    }


situationElement : String -> Maybe (Html msg) -> Maybe (Html msg) -> Html msg
situationElement label someValue someHint =
    p []
        [ span [ class "block" ] [ text label ]
        , span [ class "block font-bold" ]
            [ case someValue of
                Nothing ->
                    text "Non renseigné"

                Just valueHtml ->
                    valueHtml
            ]
        , case someHint of
            Nothing ->
                text ""

            Just hintHtml ->
                hintHtml
        ]
