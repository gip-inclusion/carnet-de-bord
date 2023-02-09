module PersonalInfo.Main exposing (Flags, Model, Msg(..), beneficiaryRights, extractRightsFromFlags, init, main, personalInfoElement, update, view)

import Browser
import Domain.Rights exposing (Rights, rsaRightKeyToString)
import Html exposing (Html, div, strong, text)
import Html.Attributes exposing (class)


type alias Flags =
    { rightRsa : Maybe String
    , rightAre : Bool
    , rightAss : Bool
    , rightBonus : Bool
    }


main : Program Flags Model Msg
main =
    Browser.element
        { init = init
        , view = view
        , update = update
        , subscriptions = \_ -> Sub.none
        }



-- MODEL


type alias Model =
    { rights : Rights
    }


init : Flags -> ( Model, Cmd Msg )
init flags =
    ( { rights = extractRightsFromFlags flags }
    , Cmd.none
    )



-- UPDATE


type Msg
    = Recv String


update : Msg -> Model -> ( Model, Cmd Msg )
update msg model =
    case msg of
        Recv _ ->
            ( model, Cmd.none )



-- VIEW


view : Model -> Html Msg
view model =
    div [ class "w-full" ]
        [ rightsInfoView model
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


rightsInfoView : Model -> Html Msg
rightsInfoView model =
    let
        rights =
            model.rights
    in
    div []
        [ personalInfoElement
            "Revenu de Solidarité Active"
            (Maybe.map (rsaRightKeyToString >> text) rights.rightRsa)
            "Non renseigné"
        , personalInfoElement "Autres droits"
            (Just
                (beneficiaryRights rights.rightAre rights.rightAss rights.rightBonus)
            )
            "Non renseignés"
        ]


extractRightsFromFlags : Flags -> Rights
extractRightsFromFlags flags =
    { rightRsa = flags.rightRsa
    , rightAre = flags.rightAre
    , rightAss = flags.rightAss
    , rightBonus = flags.rightBonus
    }


personalInfoElement : String -> Maybe (Html msg) -> String -> Html msg
personalInfoElement label someValue defaultText =
    div []
        [ strong [ class "texte-base text-france-blue" ] [ text label ]
        , div [ class "mb-2" ]
            [ case someValue of
                Nothing ->
                    text defaultText

                Just valueHtml ->
                    valueHtml
            ]
        ]
