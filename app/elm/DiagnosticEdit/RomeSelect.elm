module DiagnosticEdit.RomeSelect exposing (Model, Msg, getSelected, init, update, view)

import Domain.ProfessionalProject exposing (Rome)
import Html
import Http
import Json.Decode as Decode
import Json.Encode as Json
import UI.SearchSelect.SearchSelect as SearchSelect



-- Init


decoder : Decode.Decoder SearchSelect.Option
decoder =
    Decode.map2 SearchSelect.Option
        (Decode.field "id" Decode.string)
        (Decode.field "label" Decode.string)


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
        , url = "/graphql"
        , headers = []
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
                callbackMsg
                (Decode.at [ "data", "rome" ]
                    (Decode.list decoder)
                )
        , timeout = Nothing
        , tracker = Nothing
        }


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
