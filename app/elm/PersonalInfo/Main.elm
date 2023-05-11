module PersonalInfo.Main exposing (Flags, Model, Msg, beneficiaryRights, main)

import Browser
import Domain.BeneficiaryRights exposing (BeneficiaryRights, rsaRightKeyToString)
import Domain.PersonalIdentifiers exposing (PersonalIdentifiers)
import Html exposing (Html, div, strong, text)
import Html.Attributes exposing (class)


type alias Flags =
    { rightRsa : Maybe String
    , rightAre : Bool
    , rightAss : Bool
    , rightBonus : Bool
    , peNumber : Maybe String
    , cafNumber : Maybe String
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
    { rights : BeneficiaryRights
    , identifiers : PersonalIdentifiers
    }


init : Flags -> ( Model, Cmd Msg )
init flags =
    ( { rights = extractRightsFromFlags flags
      , identifiers = extractIdentifiersFromFlags flags
      }
    , Cmd.none
    )



-- UPDATE


type alias Msg =
    ()



-- VIEW


view : Model -> Html Msg
view { rights, identifiers } =
    div [ class "flex flex-row space-x-4" ]
        [ div [ class "w-full" ]
            [ personalInfoElement "Identifiant CAF/MSA"
                (Maybe.map text identifiers.cafNumber)
                "Non renseigné"
            , personalInfoElement "Revenu de Solidarité Active"
                (Maybe.map (rsaRightKeyToString >> text) rights.rightRsa)
                "Non renseigné"
            ]
        , div [ class "w-full" ]
            [ personalInfoElement "Identifiant Pôle emploi"
                (Maybe.map text identifiers.peNumber)
                "Non renseigné"
            , personalInfoElement "Autre(s) droit(s)"
                (Just
                    (beneficiaryRights rights.rightAre rights.rightAss rights.rightBonus)
                )
                "Non renseignés"
            ]
        ]


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


extractRightsFromFlags : Flags -> BeneficiaryRights
extractRightsFromFlags flags =
    { rightRsa = flags.rightRsa
    , rightAre = flags.rightAre
    , rightAss = flags.rightAss
    , rightBonus = flags.rightBonus
    }


extractIdentifiersFromFlags : Flags -> PersonalIdentifiers
extractIdentifiersFromFlags flags =
    { peNumber = flags.peNumber
    , cafNumber = flags.cafNumber
    }


personalInfoElement : String -> Maybe (Html msg) -> String -> Html msg
personalInfoElement label someValue defaultText =
    div []
        [ strong [ class "texte-base text-vert-cdb" ] [ text label ]
        , div [ class "mb-2" ]
            [ Maybe.withDefault (text defaultText) someValue ]
        ]
