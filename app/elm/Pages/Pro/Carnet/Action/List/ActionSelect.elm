module Pages.Pro.Carnet.Action.List.ActionSelect exposing (Model, Msg, RefAction, apiSearch, getSelected, init, reset, update, view)

import Extra.GraphQL
import GraphQL.Enum.Ref_theme_enum as RefTheme
import Html
import Pages.Pro.Carnet.Action.List.SearchRefAction exposing (Query_root)
import UI.SearchSelect.SearchSelect as SearchSelect



-- Init


type alias RefAction =
    { id : String, description : String, theme : RefTheme.Ref_theme_enum }


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
    let
        refTheme =
            RefTheme.fromString theme |> Maybe.withDefault RefTheme.Logement
    in
    Extra.GraphQL.postOperation
        (Pages.Pro.Carnet.Action.List.SearchRefAction.query { searchString = search })
        (Result.map
            (toOptions refTheme)
            >> callbackMsg
        )


toOptions :
    RefTheme.Ref_theme_enum
    -> Query_root
    -> List SearchSelect.Option
toOptions refTheme =
    .ref_actions
        >> groupRefActionsByTheme refTheme
        >> List.map toSelectOption


toSelectOption : RefAction -> { id : String, label : String }
toSelectOption action =
    { id = action.id, label = action.description }


groupRefActionsByTheme : RefTheme.Ref_theme_enum -> List RefAction -> List RefAction
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
