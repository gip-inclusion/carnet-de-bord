module Extra.Http exposing (printError)

import Http


printError : Http.Error -> String
printError error =
    case error of
        Http.BadUrl url ->
            "URL invalide : " ++ url

        Http.Timeout ->
            "Timeout"

        Http.NetworkError ->
            "Erreur réseau"

        Http.BadStatus httpStatus ->
            "Statut HTTP invalide : " ++ String.fromInt httpStatus

        Http.BadBody message ->
            "Body invalide : " ++ message
