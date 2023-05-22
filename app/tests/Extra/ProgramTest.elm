module Extra.ProgramTest exposing (expectView)

import Expect
import ProgramTest
import Test.Html.Query as Query


expectView :
    List (Query.Single msg -> Expect.Expectation)
    -> ProgramTest.ProgramTest model msg effect
    -> Expect.Expectation
expectView list test =
    ensureView list test
        |> ProgramTest.done


ensureView :
    List (Query.Single msg -> Expect.Expectation)
    -> ProgramTest.ProgramTest model msg effect
    -> ProgramTest.ProgramTest model msg effect
ensureView list test =
    ProgramTest.ensureView
        (Expect.all list)
        test
