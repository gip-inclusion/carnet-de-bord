module Pages.Pro.Carnet.Action.List.ActionSelect exposing (Action, Model, Msg, init, update, view)

import Api exposing (Api)
import Domain.Action.Id exposing (ActionId)
import Html
import Http
import Json.Decode as Decode
import Json.Encode as Json
import UI.SearchSelect.Component



-- Init


type alias Action =
    { id : ActionId, description : String }


decoder : Decode.Decoder Action
decoder =
    Decode.map2 Action
        (Decode.field "id" Domain.Action.Id.decoder)
        (Decode.field "description" Decode.string)


type alias Model =
    UI.SearchSelect.Component.Model Action


init :
    { api : Api
    , errorLog : String -> Cmd msg
    }
    -> Model
init props =
    UI.SearchSelect.Component.init
        { id = "select-action"
        , selected = Nothing
        , api = apiSearch props.api
        , optionLabel = .description
        , label = "Actions"
        , searchPlaceholder = "Rechercher une action"
        , defaultOption = "Sélectionner une action"
        }


apiSearch :
    Api
    ->
        { search : String
        , callbackMsg : Result () (List Action) -> UI.SearchSelect.Component.Msg Action
        }
    -> Cmd (UI.SearchSelect.Component.Msg Action)
apiSearch api { search, callbackMsg } =
    let
        query =
            """
query GetRefActions {
  actions: ref_action(order_by: [{ theme: asc_nulls_first }, { description: asc_nulls_first }]) {
    id
    description
    theme
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
                            [ ( "searchString", Json.string search )
                            ]
                      )
                    ]
                )
        , expect =
            Http.expectJson
                (Result.mapError (always ()) >> callbackMsg)
                (Decode.at [ "data", "actions" ]
                    (Decode.list decoder)
                )
        , timeout = Nothing
        , tracker = Nothing
        }



-- Update


type alias Msg =
    UI.SearchSelect.Component.Msg Action


update : Msg -> Model -> ( Model, Cmd Msg )
update msg model =
    UI.SearchSelect.Component.update msg model



-- View


view : Model -> Html.Html Msg
view model =
    UI.SearchSelect.Component.view model
