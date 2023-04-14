module RsaRightNotice.Main exposing (Flags, Model, Msg, main)

import Browser
import Date
import Domain.BeneficiaryRights exposing (RsaRight(..), closureReasonKeyToString, extractRsaFlagsToRsa, suspensionReasonKeyToString)
import Html exposing (Html, div, p, text)
import Html.Attributes exposing (attribute, class)


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
    case model.rsaRight of
        Just rsaRight ->
            case rsaRight of
                OuvertVersementSuspendu (Just reason) ->
                    header ("Droit RSA ouvert mais versement suspendu (" ++ suspensionReasonKeyToString reason ++ ")") "text-warning"

                OuvertVersementSuspendu Nothing ->
                    header "Droit RSA ouvert mais versement suspendu" "text-warning"

                Clot (Just reason) (Just closureDate) ->
                    header ("Droit RSA clot au " ++ formatDate closureDate ++ " (" ++ closureReasonKeyToString reason ++ ")") "text-error"

                Clot (Just reason) Nothing ->
                    header ("Droit RSA clot (" ++ closureReasonKeyToString reason ++ ")") "text-error"

                Clot Nothing (Just closureDate) ->
                    header ("Droit RSA clot au " ++ formatDate closureDate) "text-error"

                Clot Nothing Nothing ->
                    header "Droit RSA clot" "text-error"

                ClotMoisAnterieur (Just reason) (Just closureDate) ->
                    header ("Droit RSA clot au " ++ formatDate closureDate ++ " (" ++ closureReasonKeyToString reason ++ ")") "text-error"

                ClotMoisAnterieur (Just reason) Nothing ->
                    header ("Droit RSA clot (" ++ closureReasonKeyToString reason ++ ")") "text-error"

                ClotMoisAnterieur Nothing (Just closureDate) ->
                    header ("Droit RSA clot au " ++ formatDate closureDate) "text-error"

                ClotMoisAnterieur Nothing Nothing ->
                    header "Droit RSA clot" "text-error"

                _ ->
                    text ""

        Nothing ->
            text ""


formatDate : Date.Date -> String
formatDate date =
    date |> Date.format "dd/MM/yyyy"


header : String -> String -> Html Msg
header label colorClass =
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
                let
                    closureDate =
                        flags.rsaClosureDate

                    closureReason =
                        flags.rsaClosureReason

                    suspensionReason =
                        flags.rsaSuspensionReason
                in
                extractRsaFlagsToRsa flags.rsaRight suspensionReason closureReason closureDate
            )
