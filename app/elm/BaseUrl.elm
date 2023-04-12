module BaseUrl exposing (BaseUrl, buildUrl, parse, toString)

{-| BaseUrl aims to represent base url of apis. It can be with or without a context (a path after the domain name).

It is based on elm/url, thus buildUrl works the same as in this module.

Check the tests for use examples

## Definitions
@docs BaseUrl

## Parsing
@docs parse

## Creating URLs
@docs buildUrl, toString


-}

import Url
import Url.Builder

type alias BaseUrl =
    { protocol : Url.Protocol
    , host : String
    , port_ : Maybe Int
    , path : List String
    }


parse : String -> Result String BaseUrl
parse raw =
    Url.fromString raw
        |> Result.fromMaybe "could not be parsed as a Url"
        |> Result.andThen
            (\url ->
                if url.query /= Nothing then
                    Result.Err "should not have a query string"

                else if url.fragment /= Nothing then
                    Result.Err "should not have a fragment"

                else
                    Result.Ok
                        { protocol = url.protocol
                        , host = url.host
                        , port_ = url.port_
                        , path = String.split "/" url.path |> List.filter (not << String.isEmpty)
                        }
            )
        |> Result.mapError ((++) ("'" ++ raw ++ "' "))


buildUrl : BaseUrl -> List String -> List Url.Builder.QueryParameter -> String
buildUrl baseUrl path =
    Url.Builder.crossOrigin
        ({ protocol = baseUrl.protocol
         , host = baseUrl.host
         , port_ = baseUrl.port_
         , path = ""
         , query = Nothing
         , fragment = Nothing
         }
            |> Url.toString
        )
        (baseUrl.path ++ path)


toString : BaseUrl -> String
toString url =
    buildUrl url [] []
