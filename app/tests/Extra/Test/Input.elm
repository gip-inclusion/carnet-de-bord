module Extra.Test.Input exposing (expectInputHas, fillIn)

import Expect
import Html.Attributes as Attr
import ProgramTest
import Test.Html.Event
import Test.Html.Query as Query
import Test.Html.Selector as Selector


{-| Inputs the value in the field matching the label **if they are both wrapped in a node**
-}
fillIn : { label : String, value : String } -> ProgramTest.ProgramTest model msg effect -> ProgramTest.ProgramTest model msg effect
fillIn { label, value } test =
    test
        |> ProgramTest.simulateDomEvent (inputQuery { label = label }) (Test.Html.Event.input value)
        |> ProgramTest.ensureView
            (expectInputHas
                { label = label
                , value = value
                }
            )


expectInputHas : { label : String, value : String } -> Query.Single msg -> Expect.Expectation
expectInputHas { label, value } =
    inputQuery { label = label }
        >> Query.has [ Selector.attribute <| Attr.value value ]


inputQuery : { label : String } -> Query.Single msg -> Query.Single msg
inputQuery { label } =
    Query.find [ Selector.containing [ Selector.text label ] ]
        >> Query.find [ Selector.tag "input" ]
