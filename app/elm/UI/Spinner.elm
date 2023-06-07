module UI.Spinner exposing (..)

import Html exposing (Html)
import Html.Attributes as Attr


view : String -> Html msg
view label =
    Html.div
        [ Attr.class "flex items-center gap-2 text-gray-500"
        , Attr.attribute "role" "status"
        ]
        [ Html.span
            [ Attr.class "h-8 w-8 block rounded-full border-4 border-t-vert-cdb-500 animate-spin"
            ]
            []
        , Html.text label
        ]
