module BaseUrl_Tests exposing (..)

import BaseUrl
import Expect
import Extra.Expect
import Extra.Test exposing (..)
import Test exposing (..)
import Url.Builder


suite : Test
suite =
    describe "BaseUrl"
        [ describe "parse"
            [ parameterTest "parses and builds to the same url"
                [ "http://localhost:8000/"
                , "http://localhost:8000/haha"
                , "http://localhost:8000/haha/hoho"
                ]
              <|
                \url ->
                    url
                        |> BaseUrl.parse
                        |> Result.map (\base -> BaseUrl.buildUrl base [] [])
                        |> Extra.Expect.ok (Expect.equal url)
            , parameterTest "rejects urls that can't be parsed"
                [ "not a url", "localhost", "/home" ]
              <|
                \url ->
                    url
                        |> BaseUrl.parse
                        |> Expect.equal (Result.Err <| "'" ++ url ++ "' could not be parsed as a Url")
            ]
        , describe "buildUrl"
            [ parameterTest "buildUrl allows to expand the path"
                [ "http://localhost:8000", "http://localhost:8000/with/context" ]
              <|
                \url ->
                    url
                        |> BaseUrl.parse
                        |> Result.map (\base -> BaseUrl.buildUrl base [ "v1", "nps-rating" ] [])
                        |> Extra.Expect.ok (Expect.equal <| url ++ "/v1/nps-rating")
            , test "buildUrl allows adding query parameters and fragments" <|
                \_ ->
                    "http://localhost:8000"
                        |> BaseUrl.parse
                        |> Result.map (\base -> BaseUrl.buildUrl base [] [Url.Builder.string "query" "query-value"])
                        |> Extra.Expect.ok (Expect.equal "http://localhost:8000/?query=query-value")
            ]
        ]
