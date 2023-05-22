module Extra.Test.SearchSelect exposing (expectSearchSelectHas, selectOption)

import Expect
import ProgramTest
import Test.Html.Query as Query
import Test.Html.Selector as Selector
import UI.SearchSelect.Component


selectOption :
    { label : String
    , option : String
    , toProgramMsg : UI.SearchSelect.Component.Msg -> msg
    }
    -> ProgramTest.ProgramTest model msg effect
    -> ProgramTest.ProgramTest model msg effect
selectOption { label, option, toProgramMsg } =
    ProgramTest.update
        (toProgramMsg
            (UI.SearchSelect.Component.Select
                { id = "id"
                , label = option
                }
            )
        )
        >> ProgramTest.ensureView
            (expectSearchSelectHas
                { label = label
                , value = option
                }
            )


expectSearchSelectHas : { label : String, value : String } -> Query.Single msg -> Expect.Expectation
expectSearchSelectHas { label, value } =
    Query.find [ selector { label = label } ]
        >> Query.has
            [ Selector.tag "button"
            , Selector.exactText value
            ]


selector : { label : String } -> Selector.Selector
selector { label } =
    Selector.all
        [ Selector.classes [ "elm-select" ]
        , Selector.containing [ Selector.text label ]
        ]
