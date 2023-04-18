module Domain.Rome.Select exposing (Model, Msg, init, update, view, getSelected)

import Api exposing (Api)
import Domain.Rome.Rome as Rome exposing (Rome)
import Html
import Http
import Json.Decode as Decode
import Json.Encode as Json
import UI.SearchSelect.Component



-- Init


type alias Model =
    UI.SearchSelect.Component.Model Rome


init :
    { id : String
    , selected : Maybe Rome
    , api : Api
    }
    -> Model
init props =
    UI.SearchSelect.Component.init
        { id = props.id
        , selected = props.selected
        , api = getRome props.api
        , optionLabel = .label
        , label = "Métier recherché"
        , searchPlaceholder = "Rechercher un métier ou un code ROME"
        , defaultOption = "Projet en construction"
        }


getRome : Api -> String -> Cmd Msg
getRome api searchString =
    let
        query =
            """
            query searchRomes($searchString: String!) {
              rome: search_rome_codes(args: {search: $searchString}, limit: 50) {
                id
                label
              }
            }
            """
    in
    Http.request
        { method = "POST"
        , url = api.url
        , headers =
            [ Http.header "Authorization" ("Bearer " ++ api.authToken) ]
        , body =
            Http.jsonBody
                (Json.object
                    [ ( "query", Json.string query )
                    , ( "variables"
                      , Json.object
                            [ ( "searchString", Json.string searchString )
                            ]
                      )
                    ]
                )
        , expect =
            Http.expectJson
                UI.SearchSelect.Component.Fetched
                (Decode.at [ "data", "rome" ]
                    (Decode.list Rome.decoder)
                )
        , timeout = Nothing
        , tracker = Nothing
        }


getSelected : Model -> Maybe Rome
getSelected =
    UI.SearchSelect.Component.getSelected



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
