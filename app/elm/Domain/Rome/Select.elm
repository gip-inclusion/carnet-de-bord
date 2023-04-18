module Domain.Rome.Select exposing (Model, Msg(..), RomeData(..), getSelectedId, init, update, view)

import Api exposing (Api)
import Debouncer.Messages as Debouncer exposing (debounce, fromSeconds, provideInput, toDebouncer)
import Domain.Rome.Rome as Rome
import Html
import Html.Attributes as Attr
import Html.Events as Evts
import Html.Styled
import Http
import Json.Decode as Decode
import Json.Encode as Json
import Select
import UI.Attributes



-- Init


type alias Model =
    { id : String
    , state : Select.State
    , selected : Maybe Rome.Rome
    , romeData : RomeData
    , debouncer : Debouncer.Debouncer Msg
    , api : Api
    }


init : { id : String, selected : Maybe Rome.Rome, api : Api } -> Model
init props =
    { id = props.id
    , state = Select.initState (Select.selectIdentifier ("RomeSelector" ++ props.id))
    , selected = props.selected
    , romeData =
        props.selected
            |> Maybe.map (List.singleton >> Success)
            |> Maybe.withDefault NotAsked
    , debouncer = debounce (fromSeconds 0.5) |> toDebouncer
    , api = props.api
    }


type RomeData
    = Loading
    | NotAsked
    | Success (List Rome.Rome)


getSelectedId : Model -> Maybe String
getSelectedId model =
    model.selected |> Maybe.map .id



-- Update


type Msg
    = Fetched (Result Http.Error (List Rome.Rome))
    | FetchJobTitles String
    | OpenRomeSearch
    | SelectComponentMsg (Select.Msg Rome.Rome)
    | MsgFetchJobTitlesDebouncer (Debouncer.Msg Msg)


update : Msg -> Model -> ( Model, Cmd Msg )
update msg model =
    case msg of
        SelectComponentMsg selectMsg ->
            let
                ( action, updatedSelectState, selectCmds ) =
                    Select.update selectMsg model.state

                newModel =
                    { model | state = updatedSelectState }

                newCmds =
                    Cmd.map SelectComponentMsg selectCmds
            in
            case action of
                Just (Select.Select selected) ->
                    ( { newModel
                        | selected = Just selected
                      }
                    , newCmds
                    )

                Just (Select.InputChange value) ->
                    let
                        ( debouncerModel, debouncerCmds ) =
                            Debouncer.update update
                                fetchJobTitlesDebouncerConfig
                                (FetchJobTitles value
                                    |> provideInput
                                )
                                newModel
                    in
                    ( debouncerModel, Cmd.batch [ newCmds, debouncerCmds ] )

                _ ->
                    ( newModel, newCmds )

        OpenRomeSearch ->
            let
                selectElement =
                    Select.initState
                        (Select.selectIdentifier
                            ("RomeSelector"
                                ++ model.id
                            )
                        )

                -- Because it's being used as a dropdown we want a fresh state
                -- every time an action is clicked.
                ( _, focusedSelectState, cmds ) =
                    -- Focusing the select. Using the Select Cmd
                    -- ensures the menu is open on focus which is what you probably want
                    -- for a dropdown menu.
                    Select.update Select.focus selectElement

            in
            ( { model | state = focusedSelectState }
            , Cmd.map SelectComponentMsg cmds
            )

        FetchJobTitles searchString ->
            if String.isEmpty searchString then
                ( { model | romeData = NotAsked }, Cmd.none )

            else
                ( { model | romeData = Loading }
                , getRome model.api searchString
                )

        Fetched result ->
            case result of
                Ok romeData ->
                    ( { model | romeData = Success romeData }, Cmd.none )

                Err _ ->
                    -- TODO: Que fait-on des erreurs http ?
                    ( model, Cmd.none )

        MsgFetchJobTitlesDebouncer subMsg ->
            Debouncer.update update fetchJobTitlesDebouncerConfig subMsg model


fetchJobTitlesDebouncerConfig : Debouncer.UpdateConfig Msg Model
fetchJobTitlesDebouncerConfig =
    { mapMsg = MsgFetchJobTitlesDebouncer
    , getDebouncer = .debouncer
    , setDebouncer = \debouncer model -> { model | debouncer = debouncer }
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
        , expect = Http.expectJson Fetched (Decode.at [ "data", "rome" ] (Decode.list Rome.decoder))
        , timeout = Nothing
        , tracker = Nothing
        }



-- View


view : Model -> Html.Html Msg
view model =
    Html.div [ Attr.class "fr-input-group elm-select" ]
        [ Html.span [ Attr.class "fr-label" ] [ Html.text "Métier recherché" ]
        , Html.button
            [ Attr.class "fr-select text-left"
            , Attr.type_ "button"
            , Evts.onClick OpenRomeSearch
            , UI.Attributes.ariaExpanded (Select.isMenuOpen model.state)
            ]
            [ Maybe.withDefault "Projet en construction" (Maybe.map .label model.selected) |> Html.text
            ]
        , if model.state |> Select.isMenuOpen then
            Html.div []
                [ Select.view
                    (Select.menu
                        |> Select.state model.state
                        |> Select.menuItems (romeDataToMenuItems model.romeData)
                        |> Select.placeholder "Rechercher un métier ou un code ROME"
                        |> Select.loadingMessage "Chargement..."
                        |> Select.ariaDescribedBy ("select-usage-" ++ model.id)
                        |> Select.loading (model.romeData == Loading)
                    )
                    |> Html.Styled.toUnstyled
                    |> Html.map
                        SelectComponentMsg
                , Html.p
                    [ Attr.class "sr-only"
                    , Attr.id ("select-usage-" ++ model.id)
                    ]
                    [ Html.text "Utilisez les touches flèches pour naviguer dans la liste des suggestions"
                    ]
                , Html.label
                    [ Attr.class "sr-only"
                    , Attr.for ("RomeSelector" ++ model.id ++ "__elm-select")
                    ]
                    [ Html.text "Rechercher un métier ou un code ROME" ]
                ]

          else
            Html.text ""
        ]


selectedRomeToMenuItem : Rome.Rome -> Select.MenuItem Rome.Rome
selectedRomeToMenuItem rome =
    Select.basicMenuItem { item = rome, label = rome.label } |> Select.filterableMenuItem False



-- TODO HMP est-ce qu'on peut pas avoir juste une liste ?


romeDataToMenuItems : RomeData -> List (Select.MenuItem Rome.Rome)
romeDataToMenuItems romeData =
    case romeData of
        Success data ->
            data |> List.map selectedRomeToMenuItem

        _ ->
            []
