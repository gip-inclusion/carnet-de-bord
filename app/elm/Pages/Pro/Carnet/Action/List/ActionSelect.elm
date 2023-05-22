module Pages.Pro.Carnet.Action.List.ActionSelect exposing (Model, Msg, RefAction, apiSearch, getSelected, init, reset, update, view)

import Html
import Http
import Json.Decode as Decode
import Json.Encode as Json
import UI.SearchSelect.Component



-- Init


type alias RefAction =
    { id : String, description : String, theme : String }


decoder : Decode.Decoder RefAction
decoder =
    Decode.map3 RefAction
        (Decode.field "id" Decode.string)
        (Decode.field "description" Decode.string)
        (Decode.field "theme" Decode.string)


type alias Model =
    { theme : String
    , selectModel : UI.SearchSelect.Component.Model
    }


init :
    { actionSearchApi : UI.SearchSelect.Component.SearchApi
    , theme : String
    }
    -> ( Model, Cmd Msg )
init props =
    { theme = props.theme
    , selectModel =
        UI.SearchSelect.Component.init
            { id = "select-action"
            , selected = Nothing
            , api = props.actionSearchApi
            , label = "Actions"
            , searchPlaceholder = "Rechercher une action"
            , defaultOption = "Sélectionner une action"
            }
    }
        -- Call update with the initial model in order to get a visible list of actions when
        -- we open the select
        |> update (UI.SearchSelect.Component.Search "")


reset : Model -> ( Model, Cmd Msg )
reset model =
    { model | selectModel = UI.SearchSelect.Component.reset model.selectModel }
        -- On forwarde vers update afin d'avoir la liste des actions visible à l'ouverture
        |> update (UI.SearchSelect.Component.Search "")


getSelected : Model -> Maybe UI.SearchSelect.Component.Option
getSelected =
    .selectModel
        >> UI.SearchSelect.Component.getSelected


apiSearch : String -> UI.SearchSelect.Component.SearchApi
apiSearch theme { search, callbackMsg } =
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
                    |> Decode.map
                        (groupRefActionsByTheme theme
                            >> List.map toSelectOption
                        )
                )
        , timeout = Nothing
        , tracker = Nothing
        }


toSelectOption : RefAction -> { id : String, label : String }
toSelectOption action =
    { id = action.id, label = action.description }


groupRefActionsByTheme : String -> List RefAction -> List RefAction
groupRefActionsByTheme theme actions =
    -- First only keep actions of the current theme and sort them alphabetically
    (actions
        |> List.filter (\action -> action.theme == theme)
        |> List.sortBy .description
    )
        -- Then keep the other actions and sort them alphabetically
        ++ (actions
                |> List.filter (\action -> action.theme /= theme)
                |> List.sortBy .description
           )



-- Update


type alias Msg =
    UI.SearchSelect.Component.Msg


update : Msg -> Model -> ( Model, Cmd Msg )
update msg model =
    let
        ( nextSelect, selectCmd ) =
            UI.SearchSelect.Component.update msg model.selectModel
    in
    ( { model | selectModel = nextSelect }, selectCmd )



-- View


view : Model -> Html.Html Msg
view model =
    UI.SearchSelect.Component.view model.selectModel
