module UI.SearchSelect.Fixtures exposing (fakeSearchApi)

import Task
import UI.SearchSelect.Component as SearchSelect


fakeSearchApi : SearchSelect.SearchApi
fakeSearchApi { callbackMsg } =
    Task.succeed
        [ { id = "fake1"
          , label = "Fake 1"
          }
        , { id = "fake2"
          , label = "Fake 2"
          }
        , { id = "fake3"
          , label = "Fake 3"
          }
        ]
        |> Task.map Ok
        |> Task.perform callbackMsg
