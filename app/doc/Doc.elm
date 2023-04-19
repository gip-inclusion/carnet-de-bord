module Doc exposing (main)

import ElmBook exposing (Book, book, withChapterGroups)
import UI.SearchSelect.Doc


main : Book ()
main =
    book "Carnet de bord"
        |> withChapterGroups
            [ ( "UI"
              , [ UI.SearchSelect.Doc.doc
                ]
              )
            ]
