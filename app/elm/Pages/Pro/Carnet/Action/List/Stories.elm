module Pages.Pro.Carnet.Action.List.Stories exposing (main)

import Date
import Domain.Action.Id exposing (ActionId(..))
import Domain.Action.Statut
import Pages.Pro.Carnet.Action.List.Page as Page
import Storybook.Component exposing (Component)
import Storybook.Controls
import Time


main : Component Page.Model Page.Msg
main =
    Storybook.Component.sandbox
        { controls = Storybook.Controls.none
        , init =
            Page.init
                { actions =
                    [ { id = ActionId "1"
                      , description = "Première action"
                      , creePar =
                            { id = "123"
                            , lastName = "MICHEL"
                            , firstName = "Daniel"
                            , email = "daniel.michel@gmail.com"
                            }
                      , statut = Domain.Action.Statut.Realisee
                      , dateDeDebut = Date.fromPosix Time.utc <| Time.millisToPosix 0
                      }
                    , { id = ActionId "2"
                      , description = "Deuxième action"
                      , creePar =
                            { id = "456"
                            , lastName = "DUPONT"
                            , firstName = "Françoise"
                            , email = "francoise.dupont@gmail.com"
                            }
                      , statut = Domain.Action.Statut.Abandonnee
                      , dateDeDebut = Date.fromPosix Time.utc <| Time.millisToPosix 1682002405000
                      }
                    ]
                , theme = "theme"
                , api =
                    { url = ""
                    , authToken = ""
                    }
                }
        , update = Page.update
        , view = always <| Page.view
        }
