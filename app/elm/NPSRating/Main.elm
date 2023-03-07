module NPSRating.Main exposing (..)

import Browser
import Html exposing (..)
import Html.Attributes exposing (attribute, class, disabled, for, id, method, name, required, title, type_, value)
import Html.Events exposing (onCheck, onClick, onSubmit, preventDefaultOn)
import Http
import Json.Decode as Decode
import Json.Encode as Encode
import Task
import Time


type alias Flags =
    { backendAPI : String
    , serverUrl : String
    , token : String
    }


type alias Model =
    { nps : Maybe Int
    , isOpen : Bool
    , backendAPI : String
    , serverUrl : String
    , token : String
    , errorText : String
    , disableSubmit : Bool
    }


init : Flags -> ( Model, Cmd Msg )
init flags =
    ( { isOpen = False
      , nps = Nothing
      , backendAPI = flags.backendAPI
      , serverUrl = flags.serverUrl
      , token = flags.token
      , errorText = ""
      , disableSubmit = False
      }
    , getLastRatingDates flags.serverUrl flags.token
    )


type alias LastRatingDates =
    { created_at_posix_ms : Maybe Float
    , dismissed_at_posix_ms : Maybe Float
    }


type Msg
    = DoNothing
    | Close
    | Open
    | SelectNPS Int
    | Submit
    | CloseModal (Result Http.Error ())
    | LastRatingDatesFetched (Result Http.Error LastRatingDates)
    | TimeAvailable LastRatingDates Time.Posix


main : Program Flags Model Msg
main =
    Browser.element
        { init = init
        , view = view
        , update = update
        , subscriptions = \_ -> Sub.none
        }


getLastRatingDates : String -> String -> Cmd Msg
getLastRatingDates serverUrl token =
    let
        query =
            """
            query latestNPSAnswers {
              nps_rating(order_by: {created_at_posix_ms: desc}, limit: 1) {
                created_at_posix_ms
              }
              nps_rating_dismissal(order_by: {dismissed_at_posix_ms: desc}, limit: 1) {
                dismissed_at_posix_ms
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
            Http.jsonBody (Encode.object [ ( "query", Encode.string query ) ])
        , expect = Http.expectJson LastRatingDatesFetched lastRatingDatesDecoder
        , timeout = Nothing
        , tracker = Nothing
        }


lastRatingDatesDecoder : Decode.Decoder LastRatingDates
lastRatingDatesDecoder =
    Decode.map2 LastRatingDates
        (Decode.at
            [ "data", "nps_rating" ]
            (Decode.maybe (Decode.index 0 (Decode.field "created_at_posix_ms" Decode.float)))
        )
        (Decode.at
            [ "data", "nps_rating_dismissal" ]
            (Decode.maybe (Decode.index 0 (Decode.field "dismissed_at_posix_ms" Decode.float)))
        )


submitRating : Model -> Cmd Msg
submitRating model =
    case model.nps of
        Just score ->
            Http.request
                { method = "POST"
                , url = model.backendAPI ++ "/v1/nps-rating/create"
                , headers = [ Http.header "jwt-token" model.token ]
                , body =
                    Http.jsonBody
                        (Encode.object [ ( "score", Encode.int score ) ])
                , expect = Http.expectWhatever CloseModal
                , timeout = Nothing
                , tracker = Nothing
                }

        Nothing ->
            Cmd.none


dismiss : Model -> Cmd Msg
dismiss model =
    let
        query =
            """
            mutation dismissNPS {
              insert_nps_rating_dismissal_one(object: {}) { id }
            }
            """
    in
    Http.request
        { method = "POST"
        , url = model.serverUrl
        , headers = [ Http.header "Authorization" ("Bearer " ++ model.token) ]
        , body = Http.jsonBody (Encode.object [ ( "query", Encode.string query ) ])
        , expect = Http.expectWhatever CloseModal
        , timeout = Nothing
        , tracker = Nothing
        }


lastAnsweredAt : LastRatingDates -> Maybe Float
lastAnsweredAt lastRatingDates =
    case lastRatingDates.created_at_posix_ms of
        Just createdAt ->
            case lastRatingDates.dismissed_at_posix_ms of
                Just dismissedAt ->
                    Just (max createdAt dismissedAt)

                Nothing ->
                    Just createdAt

        Nothing ->
            lastRatingDates.dismissed_at_posix_ms


shouldShow : Time.Posix -> LastRatingDates -> Bool
shouldShow time lastRatingDates =
    let
        timeInt =
            Time.posixToMillis time

        twoWeeksMs =
            1000 * 60 * 60 * 24 * 14

        maybeAnsweredAt =
            lastAnsweredAt lastRatingDates
    in
    case maybeAnsweredAt of
        Just answeredAt ->
            (timeInt - round answeredAt) > twoWeeksMs

        Nothing ->
            True


update : Msg -> Model -> ( Model, Cmd Msg )
update msg model =
    case msg of
        Close ->
            ( model, dismiss model )

        Open ->
            ( { model | isOpen = True }, Cmd.none )

        SelectNPS nps ->
            ( { model | nps = Just nps }, Cmd.none )

        Submit ->
            ( { model | disableSubmit = True }, submitRating model )

        CloseModal result ->
            case result of
                Ok _ ->
                    ( { model | isOpen = False }, Cmd.none )

                Err error ->
                    let
                        retry =
                            "Une erreur est survenue, merci de réessayer plus tard."

                        oops =
                            "Une erreur est survenue."

                        errorText =
                            case error of
                                Http.Timeout ->
                                    retry

                                Http.BadStatus status ->
                                    case status of
                                        502 ->
                                            retry

                                        503 ->
                                            retry

                                        504 ->
                                            retry

                                        _ ->
                                            oops

                                _ ->
                                    oops
                    in
                    ( { model | errorText = errorText, disableSubmit = False }, Cmd.none )

        LastRatingDatesFetched lastRatingDates ->
            case lastRatingDates of
                Ok dates ->
                    ( model, Task.perform (TimeAvailable dates) Time.now )

                Err _ ->
                    -- In doubt, do not show the NPS rating modal.
                    ( model, Cmd.none )

        TimeAvailable lastRatingDates time ->
            ( { model | isOpen = shouldShow time lastRatingDates }, Cmd.none )

        DoNothing ->
            ( model, Cmd.none )


scoreButton : Model -> Int -> List (Html Msg)
scoreButton model n =
    let
        nAsText =
            String.fromInt n

        idText =
            "nps-rating-" ++ nAsText

        btnClasses =
            "fr-btn"
                ++ (case model.nps of
                        Just nps ->
                            if nps == n then
                                ""

                            else
                                " fr-btn--tertiary"

                        Nothing ->
                            " fr-btn--tertiary"
                   )

        labelText =
            case n of
                0 ->
                    "Probabilité 0 sur 10 : Peu probable"

                10 ->
                    "Probabilité 10 sur 10 : Très probable"

                val ->
                    "Probabilité " ++ String.fromInt n ++ " sur 10"
    in
    [ label [ class (btnClasses ++ " relative"), for idText ]
        [ input
            [ type_ "radio"
            , id idText
            , name "nps"
            , class
                (btnClasses
                    -- Let the parent label be styled, the input covers the label
                    ++ " absolute top-0 left-0 appearance-none rounded-none w-full bg-none bg-transparent m-0"
                )
            , required True
            , value nAsText
            , attribute "aria-label" labelText
            , onCheck (\checked -> SelectNPS n)
            ]
            []
        , text nAsText
        ]
    ]


view : Model -> Html Msg
view model =
    let
        openAttribute =
            if model.isOpen then
                [ attribute "open" "" ]

            else
                []
    in
    Html.node "dialog"
        ([ id "nps-rating-dialog"
         , attribute "aria-modal" "true"
         , attribute "role" "dialog"
         , class "fixed bottom-0 z-10 p-0 m-0 fr-col-12 fr-col-md-10 fr-col-lg-8 fr-col-xl-6"
         ]
            ++ openAttribute
        )
        [ form [ method "dialog", preventDefaultOn "submit" (Decode.succeed ( DoNothing, True )) ]
            [ div
                [ class "fr-modal__body" ]
                [ div [ class "fr-modal__header" ]
                    [ button
                        [ class "fr-link fr-link--close"
                        , title "Fermer la fenêtre de recueil de la satisfaction"
                        , type_ "button"
                        , attribute "aria-controls" "nps-rating-dialog"
                        , onClick Close
                        ]
                        [ text "Fermer" ]
                    ]
                , div [ class "fr-modal__content" ]
                    ((if String.isEmpty model.errorText then
                        []

                      else
                        [ div [ class "fr-alert fr-alert--error fr-alert--sm mb-2", attribute "role" "alert" ]
                            [ p [] [ text model.errorText ]
                            ]
                        ]
                     )
                        ++ [ fieldset []
                                [ legend [] [ strong [] [ text "Quelle est la probabilité que vous recommandiez Carnet de Bord à un collègue ?" ] ]
                                , div [ class "fr-btns-group--inline fr-btns-group--center fr-btns-group--sm mt-4 mb-2" ]
                                    (List.range 0 10
                                        |> List.map (scoreButton model)
                                        |> List.concat
                                    )
                                , span [] [ text "Peu probable" ]
                                , span [ class "float-right" ] [ text "Très probable" ]
                                ]
                           ]
                    )
                , div [ class "fr-modal__footer" ]
                    [ ul
                        [ class "fr-btns-group fr-btns-group--right fr-btns-group--inline-reverse fr-btns-group--inline-lg fr-btns-group--icon-left" ]
                        [ li [] [ button [ class "fr-btn", disabled model.disableSubmit, onClick Submit ] [ text "Envoyer ma réponse" ] ]
                        ]
                    ]
                ]
            ]
        ]
