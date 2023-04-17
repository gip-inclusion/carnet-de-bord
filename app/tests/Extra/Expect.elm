module Extra.Expect exposing (..)

import Expect


{-| Applies the expectation to the the ok value or fails

        Extra.Expect.ok (Expect.equal "Hello") (Result.Ok "Hello")
-}
ok : (a -> Expect.Expectation) -> Result error a -> Expect.Expectation
ok testF result =
    case result of
        Ok value ->
            testF value

        Err _ ->
            Expect.ok result
