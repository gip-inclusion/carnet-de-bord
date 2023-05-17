module Pages.Pro.Carnet.Action.List.ActionSelect exposing (Model, Msg, RefAction, getSelected, init, update, view)

import Domain.Action.Id exposing (ActionId)
import Html
import Http
import Json.Decode as Decode
import Json.Encode as Json
import UI.SearchSelect.Component



-- Init


type alias RefAction =
    { id : ActionId, description : String, theme : String }


decoder : Decode.Decoder RefAction
decoder =
    Decode.map3 RefAction
        (Decode.field "id" Domain.Action.Id.decoder)
        (Decode.field "description" Decode.string)
        (Decode.field "theme" Decode.string)


type alias Model =
    UI.SearchSelect.Component.Model RefAction


init : { postProcess : List RefAction -> List RefAction } -> ( Model, Cmd Msg )
init props =
    UI.SearchSelect.Component.init
        { id = "select-action"
        , selected = Nothing
        , api = apiSearch
        , optionLabel = .description
        , label = "Actions"
        , searchPlaceholder = "Rechercher une action"
        , defaultOption = "Sélectionner une action"
        , postProcess = props.postProcess
        }
        -- Call update with the initial model in order to get a visible list of actions when
        -- we open the select
        |> update (UI.SearchSelect.Component.Search "")


getSelected : Model -> Maybe RefAction
getSelected =
    UI.SearchSelect.Component.getSelected


apiSearch :
    { search : String
    , callbackMsg : Result Http.Error (List RefAction) -> UI.SearchSelect.Component.Msg RefAction
    }
    -> Cmd (UI.SearchSelect.Component.Msg RefAction)
apiSearch { search, callbackMsg } =
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
        , url = "/graphql"
        , headers =
            []
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
    UI.SearchSelect.Component.Msg RefAction


update : Msg -> Model -> ( Model, Cmd Msg )
update msg model =
    UI.SearchSelect.Component.update msg model



-- View


view : Model -> Html.Html Msg
view model =
    UI.SearchSelect.Component.view model
