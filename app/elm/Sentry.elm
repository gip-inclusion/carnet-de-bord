port module Sentry exposing (reportHttpError)

import Extra.Http
import Http


port sendError : String -> Cmd msg


reportHttpError : Http.Error -> Cmd msg
reportHttpError =
    Extra.Http.printError >> sendError
