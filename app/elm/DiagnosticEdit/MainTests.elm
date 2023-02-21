module DiagnosticEdit.MainTests exposing (..)

import DiagnosticEdit.Main exposing (formatSituationsByFocus)
import Domain.Theme exposing (Theme(..))
import Expect exposing (..)
import Set exposing (Set)
import Test exposing (..)


formatSituationsByFocusTests : Test
formatSituationsByFocusTests =
    describe "formatSituationsByFocus"
        [ describe "when there is no situation" <|
            [ test "returns empty list" <|
                \_ ->
                    formatSituationsByFocus [ { theme = Logement, id = Nothing, situations = [ { id = "id_sit_1", theme = Logement, description = "situation1" } ] } ]
                        Set.empty
                        |> Expect.equal [ { id = Nothing, theme = "logement", situations = [] } ]
            ]
        , describe "when there is one situation" <|
            [ test "returns a list with one focus containing one situation" <|
                \_ ->
                    formatSituationsByFocus [ { theme = Logement, id = Nothing, situations = [ { id = "id_sit_1", theme = Logement, description = "situation1" } ] } ]
                        (Set.fromList [ "id_sit_1" ])
                        |> Expect.equal [ { id = Nothing, theme = "logement", situations = [ "situation1" ] } ]
            ]
        ]
