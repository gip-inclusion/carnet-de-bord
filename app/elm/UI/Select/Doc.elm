module UI.Select.Doc exposing (Option(..), doc)

import ElmBook.Actions exposing (logActionWith)
import ElmBook.Chapter exposing (Chapter, chapter, withComponent, render)
import UI.Select.View as Select


type Option
    = Option1
    | Option2
    | Option3
    | Option4


doc : Chapter x
doc =
    chapter "Liste déroulante - Select"
        |> withComponent
            (Select.view
                { id = "my-select"
                , label = "Label pour liste déroulante"
                , options = [ Option1, Option2, Option3, Option4 ]
                , print = printOption
                , onSelect = logActionWith printOption "Selected"
                , selected = Nothing
                }
            )
        |> render """
cf. [Système de design de l'état](https://www.systeme-de-design.gouv.fr/elements-d-interface/composants/liste-deroulante)

<component />

```elm
type Option
    = Option1
    | Option2
    | Option3
    | Option4

type Msg
    = Selected Option
    | ...

Select.view
    { id = "my-select"
    , label = "Label pour liste déroulante"
    , options = [ Option1, Option2, Option3, Option4 ]
    , print = optionToString
    , onSelect = Selected
    , selected = Just Option1
    }

```
"""


printOption : Option -> String
printOption option =
    case option of
        Option1 ->
            "Option 1"

        Option2 ->
            "Option 2"

        Option3 ->
            "Option 3"

        Option4 ->
            "Option 4"
