module Pages.Pro.Carnet.Action.List.ActionSelect exposing (Model, Msg, RefAction, apiSearch, getSelected, init, reset, update, view)

import Extra.GraphQL
import Html
import Pages.Pro.Carnet.Action.List.SearchRefAction
import UI.SearchSelect.SearchSelect as SearchSelect



-- Init


type alias RefAction =
    { id : String, description : String, theme : String }


type alias Model =
    { theme : String
    , selectModel : SearchSelect.Model
    }


init :
    { actionSearchApi : SearchSelect.SearchApi
    , theme : String
    }
    -> ( Model, Cmd Msg )
init props =
    { theme = props.theme
    , selectModel =
        SearchSelect.init
            { id = "select-action"
            , selected = Nothing
            , api = props.actionSearchApi
            , label = "Actions"
            , searchPlaceholder = "Rechercher une action"
            , defaultOption = "Sélectionner une action"
            , mode = SearchSelect.Autocomplete { maxLength = 120 }
            }
    }
        -- Call update with the initial model in order to get a visible list of actions when
        -- we open the select
        |> update (SearchSelect.Search "")


reset : Model -> ( Model, Cmd Msg )
reset model =
    { model | selectModel = SearchSelect.reset model.selectModel }
        -- On forwarde vers update afin d'avoir la liste des actions visible à l'ouverture
        |> update (SearchSelect.Search "")


getSelected : Model -> Maybe SearchSelect.Option
getSelected =
    .selectModel
        >> SearchSelect.getSelected


apiSearch : String -> SearchSelect.SearchApi
apiSearch theme { search, callbackMsg } =
    Extra.GraphQL.postOperation
        (Pages.Pro.Carnet.Action.List.SearchRefAction.query { searchString = search })
        (Result.map
            (.ref_actions
                >> groupRefActionsByTheme theme
                >> List.map toSelectOption
            )
            >> callbackMsg
        )


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
    SearchSelect.Msg


update : Msg -> Model -> ( Model, Cmd Msg )
update msg model =
    let
        ( nextSelect, selectCmd ) =
            SearchSelect.update msg model.selectModel
    in
    ( { model | selectModel = nextSelect }, selectCmd )



-- View


view : Model -> Html.Html Msg
view model =
    SearchSelect.view model.selectModel
