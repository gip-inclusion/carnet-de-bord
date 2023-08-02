module Extra.Result exposing (fold)


fold : { onError : err -> a, onOk : ok -> a } -> Result err ok -> a
fold { onError, onOk } result =
    case result of
        Ok ok ->
            onOk ok

        Err err ->
            onError err
