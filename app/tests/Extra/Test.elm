module Extra.Test exposing (findButtonByText)

import Test.Html.Query as Query
import Test.Html.Selector as Selector


findButtonByText : String -> Query.Single msg -> Query.Single msg
findButtonByText buttonText =
    Query.find
        [ Selector.tag "button"
        , Selector.containing
            [ Selector.text buttonText
            ]
        ]
