port module Sentry exposing (sendError)


port sendError : String -> Cmd msg
