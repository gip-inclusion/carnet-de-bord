module DiagnosticEdit.MainTests exposing (..)

import DiagnosticEdit.Main exposing (groupSituationsByFocus)
import Domain.Theme exposing (Theme(..))
import Expect exposing (..)
import Test exposing (..)


groupSituationsByFocusTests : Test
groupSituationsByFocusTests =
    describe "groupSituationsByFocus"
        [ describe "when there is no situation" <|
            [ test "returns empty list" <|
                \_ ->
                    groupSituationsByFocus []
                        |> Expect.equal []
            ]
        , describe "when there is one situation" <|
            [ test "returns a list with one focus containing one situation" <|
                \_ ->
                    groupSituationsByFocus [ { id = "focus1", theme = Logement, description = "situation1" } ]
                        |> Expect.equal [ { id = "focus1", theme = "logement", situations = [ "situation1" ] } ]
            ]
        ]
