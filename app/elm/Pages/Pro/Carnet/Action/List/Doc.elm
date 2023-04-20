module Pages.Pro.Carnet.Action.List.Doc exposing (doc)

import Date
import Domain.Action.Id exposing (ActionId(..), printId)
import Domain.Action.Statut exposing (StatutAction(..), printStatus)
import ElmBook.Actions exposing (logAction)
import ElmBook.Chapter exposing (Chapter, chapter, renderComponent)
import Pages.Pro.Carnet.Action.List.View
import Select
import Time
import UI.SearchSelect.View


doc : Chapter x
doc =
    chapter "Pro/Carnet/Action/List"
        |> renderComponent
            (Pages.Pro.Carnet.Action.List.View.view
                { actions =
                    [ { id = ActionId "action-1"
                      , description = "Une action"
                      , creePar =
                            { id = "pierre.chevalier"
                            , lastName = "Chevalier"
                            , firstName = "Pierre"
                            , email = "pierre.chevalier@domaine.fr"
                            }
                      , statut = EnCours
                      , dateDeDebut = Time.millisToPosix 0 |> Date.fromPosix Time.utc
                      }
                    , { id = ActionId "action-2"
                      , description = "Une autre action"
                      , creePar =
                            { id = "pierre.chevalier"
                            , lastName = "Chevalière"
                            , firstName = "Marie"
                            , email = "pierre.chevalier@domaine.fr"
                            }
                      , statut = Abandonnee
                      , dateDeDebut = Time.millisToPosix 1020500000000 |> Date.fromPosix Time.utc
                      }
                    ]
                , messages =
                    { onStatusSelect =
                        \id status ->
                            logAction <|
                                "Passage au status '"
                                    ++ printStatus status
                                    ++ "' pour l'action d'id : "
                                    ++ printId id
                    , onAdd = logAction "Ajout d'action"
                    }
                , search =
                    { messages =
                        { onOpen = logAction "Ouverture de la recherche"
                        , onSelectMsg = always <| logAction "Sélection d'une action"
                        }
                    , props =
                        { id = "id-1"
                        , selected = Nothing
                        , optionLabel = always ""
                        , label = "Label"
                        , searchPlaceholder = "Placeholder"
                        , defaultOption = "Option par défaut"
                        , status = UI.SearchSelect.View.NotAsked
                        , state = Select.initState <| Select.selectIdentifier "id"
                        }
                    }
                }
            )
