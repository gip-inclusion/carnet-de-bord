module Extra.Test exposing (..)

import Expect
import Test exposing (..)

parameterTest : String -> List a -> (a -> Expect.Expectation) -> Test
parameterTest name parameters testF =
    describe name
        (parameters
            |> List.map
                (\value ->
                    test ("Example: " ++ Debug.toString value) <|
                        \_ ->
                            testF value
                )
        )
