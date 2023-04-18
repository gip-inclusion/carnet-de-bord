module Doc exposing (main)

import ElmBook exposing (Book, book, withChapterGroups)
import Pages.Pro.Carnet.Action.List.Doc
import UI.SearchSelect.Doc
import UI.Select.Doc


main : Book ()
main =
    book "Carnet de bord"
        |> withChapterGroups
            [ ( "UI"
              , [ UI.Select.Doc.doc
                , UI.SearchSelect.Doc.doc
                ]
              )
            , ( "Pages", [ Pages.Pro.Carnet.Action.List.Doc.doc ] )
            ]
