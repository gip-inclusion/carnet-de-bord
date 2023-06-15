module NPSRating.Main exposing (FailableModel, LastRatingDates, Model, Msg(..), main)

import Browser
import Extra.GraphQL
import Html
import Html.Attributes exposing (attribute, checked, class, disabled, for, id, method, name, required, title, type_, value)
import Html.Events exposing (onCheck, onClick, preventDefaultOn)
import Http
import Json.Decode as Decode
import NPSRating.GraphQL
import Task
import Time


type alias FailableModel =
    Result String Model


type alias Model =
    { nps : Maybe Int
    , isOpen : Bool
    , errorText : Maybe String
    , disableSubmit : Bool
    }


init : () -> ( FailableModel, Cmd Msg )
init _ =
    ( Ok
        { isOpen = False
        , nps = Nothing
        , errorText = Nothing
        , disableSubmit = False
        }
    , getLastRatingDates
    )


type alias LastRatingDates =
    { created_at_posix_ms : Maybe Float
    , dismissed_at_posix_ms : Maybe Float
    }


type Msg
    = DoNothing
    | Close
    | SelectNPS Int
    | Submit
    | RatingSent (Result Http.Error ())
    | LastRatingDatesFetched (Result Http.Error LastRatingDates)
    | TimeAvailable LastRatingDates Time.Posix


main : Program () FailableModel Msg
main =
    Browser.element
        { init = init
        , view = view
        , update = update
        , subscriptions = \_ -> Sub.none
        }


getLastRatingDates : Cmd Msg
getLastRatingDates =
    Extra.GraphQL.postOperation
        NPSRating.GraphQL.latestNPSAnswers
        (Result.map
            (\data ->
                { created_at_posix_ms = data.nps_rating |> List.head |> Maybe.andThen .created_at_posix_ms
                , dismissed_at_posix_ms = data.nps_rating_dismissal |> List.head |> Maybe.andThen .dismissed_at_posix_ms
                }
            )
            >> LastRatingDatesFetched
        )


submitRating : Model -> Cmd Msg
submitRating model =
    case model.nps of
        Just score ->
            Extra.GraphQL.postOperation
                (NPSRating.GraphQL.createNpsRating { score = score })
                (Result.map (always ()) >> RatingSent)

        Nothing ->
            Cmd.none


dismiss : Cmd Msg
dismiss =
    Extra.GraphQL.postOperation
        NPSRating.GraphQL.dismissNPS
        (Result.map (always ()) >> RatingSent)


lastAnsweredAt : LastRatingDates -> Maybe Float
lastAnsweredAt lastRatingDates =
    case ( lastRatingDates.created_at_posix_ms, lastRatingDates.dismissed_at_posix_ms ) of
        ( Just createdAt, Just dismissedAt ) ->
            Just (max createdAt dismissedAt)

        ( Just createdAt, _ ) ->
            Just createdAt

        _ ->
            lastRatingDates.dismissed_at_posix_ms


shouldShow : Time.Posix -> LastRatingDates -> Bool
shouldShow time lastRatingDates =
    let
        maybeAnsweredAt =
            lastAnsweredAt lastRatingDates
    in
    case maybeAnsweredAt of
        Just answeredAt ->
            let
                timeInt =
                    Time.posixToMillis time

                twoWeeksMs =
                    1000 * 60 * 60 * 24 * 14
            in
            (timeInt - round answeredAt) > twoWeeksMs

        Nothing ->
            True


update : Msg -> FailableModel -> ( FailableModel, Cmd Msg )
update msg failableModel =
    case failableModel of
        Err _ ->
            ( failableModel, Cmd.none )

        Ok model ->
            Tuple.mapFirst Ok <|
                case msg of
                    Close ->
                        ( model, dismiss )

                    SelectNPS nps ->
                        ( { model | nps = Just nps }, Cmd.none )

                    Submit ->
                        ( { model | disableSubmit = True }, submitRating model )

                    RatingSent result ->
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
                                ( { model | errorText = Just errorText, disableSubmit = False }, Cmd.none )

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


scoreRadio : Model -> Int -> List (Html.Html Msg)
scoreRadio model n =
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

                _ ->
                    "Probabilité " ++ String.fromInt n ++ " sur 10"
    in
    [ Html.label [ class (btnClasses ++ " relative"), for idText ]
        [ Html.input
            [ type_ "radio"
            , id idText
            , name "nps"
            , checked
                (case model.nps of
                    Just nps ->
                        nps == n

                    Nothing ->
                        False
                )
            , class
                (btnClasses
                    -- Let the parent label be styled, the input covers the label
                    ++ " absolute top-0 left-0 appearance-none rounded-none w-full bg-none bg-transparent m-0"
                )
            , required True
            , value nAsText
            , attribute "aria-label" labelText
            , onCheck (\_ -> SelectNPS n)
            ]
            []
        , Html.text nAsText
        ]
    ]


view : FailableModel -> Html.Html Msg
view failableModel =
    case failableModel of
        Ok model ->
            if model.isOpen then
                Html.node "dialog"
                    [ id "nps-rating-dialog"
                    , attribute "aria-modal" "true"
                    , attribute "open" ""
                    , attribute "role" "dialog"
                    , class "fixed bottom-0 z-10 p-0 m-0 fr-col-12 fr-col-md-10 fr-col-lg-8 fr-col-xl-6"
                    ]
                    [ Html.form [ method "dialog", preventDefaultOn "submit" (Decode.succeed ( DoNothing, True )) ]
                        [ Html.div
                            [ class "fr-modal__body" ]
                            [ Html.div [ class "fr-modal__header" ]
                                [ Html.button
                                    [ class "fr-link fr-link--close"
                                    , title "Fermer la fenêtre de recueil de la satisfaction"
                                    , type_ "button"
                                    , attribute "aria-controls" "nps-rating-dialog"
                                    , onClick Close
                                    ]
                                    [ Html.text "Fermer" ]
                                ]
                            , Html.div [ class "fr-modal__content" ]
                                ((case model.errorText of
                                    Just error ->
                                        [ Html.div [ class "fr-alert fr-alert--error fr-alert--sm mb-2", attribute "role" "alert" ]
                                            [ Html.p [] [ Html.text error ] ]
                                        ]

                                    Nothing ->
                                        []
                                 )
                                    ++ [ Html.fieldset []
                                            [ Html.legend [] [ Html.strong [] [ Html.text "Quelle est la probabilité que vous recommandiez Carnet de Bord à un collègue ?" ] ]
                                            , Html.div [ class "fr-btns-group--inline fr-btns-group--center fr-btns-group--sm mt-4 mb-2" ]
                                                (List.range 0 10
                                                    |> List.concatMap (scoreRadio model)
                                                )
                                            , Html.span [] [ Html.text "Peu probable" ]
                                            , Html.span [ class "float-right" ] [ Html.text "Très probable" ]
                                            ]
                                       ]
                                )
                            , Html.div [ class "fr-modal__footer" ]
                                [ Html.ul
                                    [ class "fr-btns-group fr-btns-group--right fr-btns-group--inline-reverse fr-btns-group--inline-lg fr-btns-group--icon-left" ]
                                    [ Html.li [] [ Html.button [ class "fr-btn", disabled model.disableSubmit, onClick Submit ] [ Html.text "Envoyer ma réponse" ] ]
                                    ]
                                ]
                            ]
                        ]
                    ]

            else
                Html.text ""

        Err _ ->
            Html.text ""
