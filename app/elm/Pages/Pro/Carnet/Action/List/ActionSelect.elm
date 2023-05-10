module Pages.Pro.Carnet.Action.List.ActionSelect exposing (Action, Model, Msg, getSelected, init, update, view)

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


init : { api : Api } -> ( Model, Cmd Msg )
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
        -- On forwarde vers update afin d'avoir la liste des actions visible à l'ouverture
        |> update (UI.SearchSelect.Component.Search "")


getSelected : Model -> Maybe Action
getSelected =
    UI.SearchSelect.Component.getSelected


apiSearch :
    Api
    ->
        { search : String
        , callbackMsg : Result Http.Error (List Action) -> UI.SearchSelect.Component.Msg Action
        }
    -> Cmd (UI.SearchSelect.Component.Msg Action)
apiSearch api { search, callbackMsg } =
    let
        query =
            """
query searchRefActions($searchString: String = "") {
    search_ref_action(args: {search: $searchString}, order_by: [{theme: asc_nulls_first}, {description: asc_nulls_first}]) {
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
            [ Http.header "Authorization" ("Bearer " ++ api.token) ]
        , body =
            Http.jsonBody
                (Json.object
                    [ ( "query", Json.string query )
                    , ( "variables"
                      , Json.object
                            [ ( "searchString", Json.string <| String.trim search )
                            ]
                      )
                    ]
                )
        , expect =
            Http.expectJson
                callbackMsg
                (Decode.at [ "data", "search_ref_action" ]
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
