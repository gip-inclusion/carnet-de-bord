module UI.SearchSelect.Doc exposing (doc)

import ElmBook.Actions exposing (logAction)
import ElmBook.Chapter exposing (Chapter, chapter, render, withComponentList)
import Html
import Html.Attributes as Attr
import Json.Encode as Json
import Select
import UI.SearchSelect.View exposing (Status(..), view)


doc : Chapter x
doc =
    chapter "Liste déroulante avec recherche"
        |> withComponentList
            [ ( "Fermée, sans sélection"
              , view
                    { id = "id"
                    , selected = Nothing
                    , optionLabel = always ""
                    , label = "Label"
                    , searchPlaceholder = "Placeholder"
                    , defaultOption = "Option par défaut"
                    , status = NotAsked
                    , state = Select.initState <| Select.selectIdentifier "id"
                    }
                    { onOpen = logAction "Ouvrir"
                    , onSelectMsg = always <| logAction "Sélectionné"
                    }
              )
            , ( "Fermée, avec sélection"
              , view
                    { id = "id"
                    , selected = Just "Option 1"
                    , optionLabel = identity
                    , label = "Label"
                    , searchPlaceholder = "Placeholder"
                    , defaultOption = "Option par défaut"
                    , status = NotAsked
                    , state = Select.initState <| Select.selectIdentifier "id"
                    }
                    { onOpen = logAction "Ouvrir"
                    , onSelectMsg = always <| logAction "Sélectionné"
                    }
              )
            , ( "Ouverte sans sélection"
              , Html.div [ Attr.property "style" <| Json.string "height: 200px" ]
                    [ view
                        { id = "id"
                        , selected = Nothing
                        , optionLabel = always ""
                        , label = "Label"
                        , searchPlaceholder = "Placeholder"
                        , defaultOption = "Option par défaut"
                        , status = NotAsked
                        , state =
                            Select.selectIdentifier "id"
                                |> Select.initState
                                |> Select.update Select.focus
                                |> (\( _, state, _ ) -> state)
                        }
                        { onOpen = logAction "Ouvrir"
                        , onSelectMsg = always <| logAction "Sélectionné"
                        }
                    ]
              )
            , ( "Recherche, en chargement"
              , Html.div [ Attr.property "style" <| Json.string "height: 200px" ]
                    [ view
                        { id = "id"
                        , selected = Nothing
                        , optionLabel = always ""
                        , label = "Label"
                        , searchPlaceholder = "Placeholder"
                        , defaultOption = "Option par défaut"
                        , status = Loading
                        , state =
                            Select.selectIdentifier "id"
                                |> Select.initState
                                |> Select.update Select.focus
                                |> (\( _, state, _ ) -> state)
                        }
                        { onOpen = logAction "Ouvrir"
                        , onSelectMsg = always <| logAction "Sélectionné"
                        }
                    ]
              )
            , ( "Recherche, chargée"
              , Html.div [ Attr.property "style" <| Json.string "height: 250px" ]
                    [ view
                        { id = "id"
                        , selected = Nothing
                        , optionLabel = identity
                        , label = "Label"
                        , searchPlaceholder = "Placeholder"
                        , defaultOption = "Option par défaut"
                        , status = Success [ "Option 1", "Option 2" ]
                        , state =
                            Select.selectIdentifier "id"
                                |> Select.initState
                                |> Select.update Select.focus
                                |> (\( _, state, _ ) -> state)
                        }
                        { onOpen = logAction "Ouvrir"
                        , onSelectMsg = always <| logAction "Sélectionné"
                        }
                    ]
              )
            , ( "Recherche, en erreur"
              , Html.div []
                    [ view
                        { id = "id"
                        , selected = Nothing
                        , optionLabel = identity
                        , label = "Label"
                        , searchPlaceholder = "Placeholder"
                        , defaultOption = "Option par défaut"
                        , status = Failed
                        , state =
                            Select.selectIdentifier "id"
                                |> Select.initState
                                |> Select.update Select.focus
                                |> (\( _, state, _ ) -> state)
                        }
                        { onOpen = logAction "Ouvrir"
                        , onSelectMsg = always <| logAction "Sélectionné"
                        }
                    ]
              )
            ]
        |> render """

Un composant qui de liste déroulante mais avec une recherche via une API.
L'utilisation du composant est décrite plus bas.

<component with-label="Fermée, sans sélection"/>
<component with-label="Fermée, avec sélection"/>
<component with-label="Ouverte sans sélection"/>
<component with-label="Recherche, en chargement"/>
<component with-label="Recherche, chargée"/>
<component with-label="Recherche, en erreur"/>

## Utilisation
Utilisez le composant `UI.SearchSelect.Component` plutôt que la vue directement.

```elm

-- Init
type alias Model =
    UI.SearchSelect.Component.Model Rome

init : Model
init =
    UI.SearchSelect.Component.init
        { id = "un identifiant unique pour ce champ"
        , selected = Nothing -- peut-être un champ de record
        , api = searchApi
        , optionLabel = .label -- une fonction qui donne un libellé à partir du type de résultat de votre recherche
        , label = "Métier recherché" -- le label du champ
        , searchPlaceholder = "Rechercher un métier ou un code ROME" -- Le placeholder du champ de recherche
        , defaultOption = "Projet en construction" -- Le texte affiché quand aucune sélection n'a été faite
        }

searchApi :
    {search: String, callbackMsg: List Rome -> UI.SearchSelect.Component.Msg Rome }
    -> Cmd (UI.SearchSelect.Component.Msg Rome)
searchApi {search, callbackMsg} =
    Http.get
        {...
        , expect =
            Http.expectJson
                (Result.mapError (always ()) >> callbackMsg)
                (Decode ...}
        , ...
        }


-- Update
type alias Msg =
    UI.SearchSelect.Component.Msg Rome


update : Msg -> Model -> ( Model, Cmd Msg )
update msg model =
    UI.SearchSelect.Component.update msg model

-- View
view : Model -> Html.Html Msg
view model =
    UI.SearchSelect.Component.view model
```
"""
