module Diagnostic.SituationElement exposing (Gender(..), view)

import Html
import Html.Attributes exposing (class)


type Gender
    = Feminine
    | Masculine


view :
    { label : { value : String, gender : Gender }
    , value : Maybe String
    , hint : Maybe (Html.Html msg)
    }
    -> Html.Html msg
view { label, value, hint } =
    Html.p [ class "text-sm" ]
        [ Html.span [ class "block" ] [ Html.text label.value ]
        , Html.span
            [ class "block font-bold" ]
            [ Html.text <| Maybe.withDefault (unfilled label.gender) value ]
        , hint |> Maybe.withDefault (Html.text "")
        ]


unfilled : Gender -> String
unfilled genderType =
    "Non renseigné"
        ++ (case genderType of
                Feminine ->
                    "e"

                Masculine ->
                    ""
           )
