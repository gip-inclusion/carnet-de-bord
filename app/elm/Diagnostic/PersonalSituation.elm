module Diagnostic.PersonalSituation exposing (DisplayTheme, Model, Msg(..), RefreshState(..), Theme, groupByTheme, init, update, view)

import Diagnostic.AllSituations as AllSituations exposing (DataSyncInfo, PersonalSituation)
import Domain.Account
import Domain.RefTheme
import Extra.Date
import GraphQL.Enum.Ref_theme_enum exposing (Ref_theme_enum)
import Html exposing (Html)
import Html.Attributes as Attr
import Http
import List.Extra
import Sentry
import UI.Spinner



-- Init


type alias Model =
    { themes : List Theme
    , refreshState : RefreshState
    , notebookId : String
    , has_pe_diagnostic : Bool
    }


type alias Theme =
    { name : Ref_theme_enum
    , situations : List PersonalSituation
    }


type RefreshState
    = Started
    | RefreshAsked
    | NothingToDo
    | Failed


init : { notebookId : String } -> ( Model, Cmd Msg )
init { notebookId } =
    ( { themes = []
      , refreshState = Started
      , notebookId = notebookId
      , has_pe_diagnostic = False
      }
    , Cmd.batch
        [ AllSituations.fetchByNotebookId notebookId FetchedSituations
        , AllSituations.syncWithPE notebookId SyncedWithPE
        ]
    )



-- Update


type Msg
    = FetchedSituations (Result Http.Error (List PersonalSituation))
    | SyncedWithPE (Result Http.Error DataSyncInfo)


update : Msg -> Model -> ( Model, Cmd Msg )
update msg model =
    case msg of
        FetchedSituations result ->
            case result of
                Err message ->
                    ( model, Sentry.reportHttpError message )

                Ok situations ->
                    ( { model | themes = groupByTheme situations }
                    , Cmd.none
                    )

        SyncedWithPE result ->
            case result of
                Err message ->
                    ( { model | refreshState = Failed }
                    , Sentry.reportHttpError message
                    )

                Ok { has_pe_diagnostic, data_has_been_updated } ->
                    if data_has_been_updated then
                        ( { model | refreshState = RefreshAsked, has_pe_diagnostic = has_pe_diagnostic }
                        , AllSituations.fetchByNotebookId model.notebookId FetchedSituations
                        )

                    else
                        ( { model | refreshState = NothingToDo, has_pe_diagnostic = has_pe_diagnostic }
                        , Cmd.none
                        )


groupByTheme : List PersonalSituation -> List Theme
groupByTheme situations =
    situations
        |> List.Extra.gatherEqualsBy .theme
        |> List.map
            (\( head, tail ) ->
                { name = head.theme
                , situations = head :: tail |> List.sortBy .description
                }
            )



-- View


view : Model -> Html msg
view { themes, refreshState } =
    Html.div
        [ Attr.class "pt-10 flex flex-col gap-4" ]
        [ Html.h3
            [ Attr.class "text-xl flex gap-4 mb-0" ]
            [ Html.text "Situation personnelle" ]
        , viewRefreshState refreshState
        , viewSituationsTable themes
        ]


viewSituationsTable : List Theme -> Html msg
viewSituationsTable themes =
    Html.div
        [ Attr.class "fr-container shadow-dsfr rounded-lg py-8" ]
        [ if List.isEmpty themes then
            Html.span [] [ Html.text "Aucune situation renseignée" ]

          else
            Html.table [ Attr.class "w-full" ]
                [ Html.thead [ Attr.class "text-left pb-4" ]
                    [ Html.th [ Attr.class "font-normal text-sm leading-10 pl-2" ] [ Html.text "Thématique" ]
                    , Html.th [ Attr.class "font-normal text-sm" ] [ Html.text "Situation" ]
                    , Html.th [ Attr.class "font-normal text-sm" ] [ Html.text "Ajouté le" ]
                    , Html.th [ Attr.class "font-normal text-sm" ] [ Html.text "Ajouté par" ]
                    ]
                , Html.tbody []
                    (themes
                        |> List.indexedMap Tuple.pair
                        |> List.concatMap viewThemeRows
                    )
                ]
        ]


viewRefreshState : RefreshState -> Html msg
viewRefreshState state =
    case state of
        Started ->
            UI.Spinner.view "Récupération des informations Pôle emploi en cours"

        _ ->
            Html.text ""


viewThemeRows : ( Int, Theme ) -> List (Html msg)
viewThemeRows ( index, { name, situations } ) =
    situations
        |> List.indexedMap Tuple.pair
        |> List.map
            (viewSituationRow
                { index = index
                , name = name
                , totalSituations = List.length situations
                }
            )


type alias DisplayTheme =
    { index : Int, name : Ref_theme_enum, totalSituations : Int }


viewSituationRow : DisplayTheme -> ( Int, PersonalSituation ) -> Html msg
viewSituationRow theme ( index, situation ) =
    Html.tr
        [ Attr.class "align-text-top text-left "
        , Attr.classList [ ( "bg-gray-100", modBy 2 theme.index == 0 ) ]
        ]
        [ viewThemeWrapperCell index theme
        , Html.td [ Attr.class "font-bold pr-8 py-3" ]
            [ Html.text situation.description ]
        , Html.td [ Attr.class "pr-8 py-3" ]
            [ Html.text (Extra.Date.print (Extra.Date.fromPosix situation.createdAt)) ]
        , Html.td [ Attr.class "py-3" ]
            [ situation.creator
                |> Maybe.map Domain.Account.print
                |> Maybe.withDefault ""
                |> Html.text
            ]
        ]


viewThemeWrapperCell : Int -> DisplayTheme -> Html msg
viewThemeWrapperCell index theme =
    if index == 0 then
        Html.th
            [ Attr.class "font-bold pr-8 pl-2 py-3"
            , Attr.rowspan theme.totalSituations
            ]
            [ theme.name
                |> Domain.RefTheme.printTheme
                |> Html.text
            ]

    else
        Html.text ""
