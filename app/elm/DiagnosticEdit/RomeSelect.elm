module DiagnosticEdit.RomeSelect exposing (Model, Msg, getSelected, init, update, view)

import DiagnosticEdit.SearchRomes
import Domain.ProfessionalProject exposing (Rome)
import Extra.GraphQL
import Html
import UI.SearchSelect.SearchSelect as SearchSelect



-- Init


type alias Model =
    SearchSelect.Model


init :
    { id : String
    , selected : Maybe Rome
    , errorLog : String -> Cmd msg
    }
    -> Model
init props =
    SearchSelect.init
        { id = props.id
        , selected = props.selected
        , api = getRome
        , label = "Métier recherché"
        , searchPlaceholder = "Rechercher un métier ou un code ROME"
        , defaultOption = "Projet en construction"
        , mode = SearchSelect.Classic
        }


getRome : SearchSelect.SearchApi
getRome { search, callbackMsg } =
    Extra.GraphQL.postOperation
        (DiagnosticEdit.SearchRomes.query { searchString = search })
        (Result.map .rome_codes >> callbackMsg)


getSelected : Model -> Maybe Rome
getSelected =
    SearchSelect.getSelected



-- Update


type alias Msg =
    SearchSelect.Msg


update : Msg -> Model -> ( Model, Cmd Msg )
update msg model =
    SearchSelect.update msg model



-- View


view : Model -> Html.Html Msg
view model =
    SearchSelect.view model
