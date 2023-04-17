module RsaRightNotice.Main exposing (Flags, Model, Msg, main)

import Browser
import Date
import Domain.BeneficiaryRights exposing (RsaRight(..), closureReasonKeyToString, suspensionReasonKeyToString)
import Html exposing (Html, div, p, text)
import Html.Attributes exposing (attribute, class)
import Result exposing (toMaybe)


type alias Flags =
    { rsaRight : Maybe String
    , rsaClosureDate : Maybe String
    , rsaClosureReason : Maybe String
    , rsaSuspensionReason : Maybe String
    }


main : Program Flags Model Msg
main =
    Browser.element
        { init = init
        , view = view
        , update = \_ model -> ( model, Cmd.none )
        , subscriptions = \_ -> Sub.none
        }



-- MODEL


type alias Model =
    { rsaRight : Maybe RsaRight
    }


init : Flags -> ( Model, Cmd Msg )
init flags =
    ( { rsaRight = extractRsaRightFromFlags flags
      }
    , Cmd.none
    )



-- UPDATE


type alias Msg =
    ()



-- VIEW


view : Model -> Html Msg
view model =
    model.rsaRight
        |> Maybe.andThen getNoticeProps
        |> Maybe.map header
        |> Maybe.withDefault (text "")


getNoticeProps : RsaRight -> Maybe { label : String, colorClass : String }
getNoticeProps droit =
    case droit of
        OuvertVersementSuspendu reason ->
            Just
                { label =
                    "Droit RSA ouvert mais versement suspendu"
                        ++ maybePrintInParens suspensionReasonKeyToString reason
                , colorClass =
                    "text-warning"
                }

        Clot reason closureDate ->
            Just
                { label =
                    "Droit RSA clot"
                        ++ maybePrintDate closureDate
                        ++ maybePrintInParens closureReasonKeyToString reason
                , colorClass = "text-error"
                }

        ClotMoisAnterieur reason closureDate ->
            Just
                { label =
                    "Droit RSA clot"
                        ++ maybePrintDate closureDate
                        ++ maybePrintInParens closureReasonKeyToString reason
                , colorClass = "text-error"
                }

        _ ->
            Nothing


maybePrintDate : Maybe Date.Date -> String
maybePrintDate closureDate =
    case closureDate of
        Just date ->
            " au" ++ formatDate date

        Nothing ->
            ""


maybePrintInParens : (a -> String) -> Maybe a -> String
maybePrintInParens f maybe =
    case maybe of
        Just value ->
            " (" ++ f value ++ ")"

        Nothing ->
            ""


formatDate : Date.Date -> String
formatDate date =
    date |> Date.format "dd/MM/yyyy"


header : { label : String, colorClass : String } -> Html Msg
header { label, colorClass } =
    div [ class "bg-gray-100" ]
        [ div [ class "fr-container" ]
            [ div [ class "flex flex-row gap-4 items-top fr-py-3w" ]
                [ div [ attribute "aria-hidden" "", class ("fr-icon-info-fill " ++ colorClass) ]
                    []
                , p [ class ("fr-text--bold mb-0 " ++ colorClass) ]
                    [ text label ]
                ]
            ]
        ]


extractRsaRightFromFlags : Flags -> Maybe RsaRight
extractRsaRightFromFlags flags =
    flags.rsaRight
        |> Maybe.andThen
            (\_ ->
                case flags.rsaRight of
                    Just "rsa_droit_ouvert_et_suspendu" ->
                        Just OuvertSuspendu

                    Just "rsa_droit_ouvert_versable" ->
                        Just OuvertVersable

                    Just "rsa_droit_ouvert_versement_suspendu" ->
                        Just (OuvertVersementSuspendu flags.rsaSuspensionReason)

                    Just "rsa_demande_en_attente" ->
                        Just DemandeEnAttente

                    Just "rsa_refuse" ->
                        Just Refuse

                    Just "rsa_clot" ->
                        Just (Clot flags.rsaClosureReason (Maybe.andThen (Date.fromIsoString >> toMaybe) flags.rsaClosureDate))

                    Just "rsa_clot_anterieur" ->
                        Just (ClotMoisAnterieur flags.rsaClosureReason (Maybe.andThen (Date.fromIsoString >> toMaybe) flags.rsaClosureDate))

                    _ ->
                        Nothing
            )
