module UI.Attributes exposing (ariaExpanded)

import Html
import Html.Attributes as Attr


ariaExpanded : Bool -> Html.Attribute msg
ariaExpanded value =
    Attr.attribute "aria-expanded"
        (if value then
            "true"

         else
            "false"
        )
