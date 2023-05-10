module Extra.Http exposing (toString)

import Http


toString : Http.Error -> String
toString error =
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
