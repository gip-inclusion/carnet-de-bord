module DiagnosticEdit.RomeSelect exposing (Model, Msg, getSelected, init, update, view)

import Domain.ProfessionalProject exposing (Rome)
import Html
import Http
import Json.Decode as Decode
import Json.Encode as Json
import UI.SearchSelect.Component



-- Init


decoder : Decode.Decoder Rome
decoder =
    Decode.map2 Rome
        (Decode.field "id" Decode.string)
        (Decode.field "label" Decode.string)


type alias Model =
    UI.SearchSelect.Component.Model Rome


init :
    { id : String
    , selected : Maybe Rome
    , errorLog : String -> Cmd msg
    }
    -> Model
init props =
    UI.SearchSelect.Component.init
        { id = props.id
        , selected = props.selected
        , api = getRome
        , optionLabel = .label
        , label = "Métier recherché"
        , searchPlaceholder = "Rechercher un métier ou un code ROME"
        , defaultOption = "Projet en construction"
        , postProcess = \id -> id
        }


getRome : { search : String, callbackMsg : Result Http.Error (List Rome) -> Msg } -> Cmd Msg
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
