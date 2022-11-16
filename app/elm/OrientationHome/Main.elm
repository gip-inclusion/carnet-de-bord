module OrientationHome.Main exposing (..)

import Browser
import Html exposing (Html, a, div, h2, h3, p, text)
import Html.Attributes exposing (class, href, title)
import Http
import Json.Decode
import Json.Encode


type alias Token =
    String


type alias Flags =
    { token : Token, serverUrl : String, accountId : String }


type alias Model =
    { token : Token, serverUrl : String, accountId : String, orientationHomeInfos : Maybe OrientationHomeInfos }


type Msg
    = HomeInfosResult (Result Http.Error OrientationHomeInfos)


type alias OrientationHomeInfos =
    { nbOriented : Int
    , nbUnoriented : Int
    , nbOrientationRequest : Int
    , nbOtherOriented : Int
    , nbOtherUnoriented : Int
    , nbOtherOrientationRequest : Int
    }


type alias OrientationInfosVariables =
    { id : String
    }


type alias GqlQuery =
    { query : String
    , variables : OrientationInfosVariables
    }


orientationHomeInfoDecoder : Json.Decode.Decoder OrientationHomeInfos
orientationHomeInfoDecoder =
    let
        unOrientedBeneficiaryParser =
            Json.Decode.field "data"
                (Json.Decode.field "unorientedBeneficiaryCount"
                    (Json.Decode.field "aggregate"
                        (Json.Decode.field "count" Json.Decode.int)
                    )
                )

        orientedBeneficiaryParser =
            Json.Decode.field "data"
                (Json.Decode.field "orientedBeneficiaryCount"
                    (Json.Decode.field "aggregate"
                        (Json.Decode.field "count" Json.Decode.int)
                    )
                )

        orientationRequestParser =
            Json.Decode.field "data"
                (Json.Decode.field "orientationRequestCount"
                    (Json.Decode.field "aggregate"
                        (Json.Decode.field "count" Json.Decode.int)
                    )
                )

        otherUnorientedBeneficiaryParser =
            Json.Decode.field "data"
                (Json.Decode.field "otherUnorientedBeneficiaryCount"
                    (Json.Decode.field "aggregate"
                        (Json.Decode.field "count" Json.Decode.int)
                    )
                )

        otherOrientedBeneficiaryParser =
            Json.Decode.field "data"
                (Json.Decode.field "otherOrientedBeneficiaryCount"
                    (Json.Decode.field "aggregate"
                        (Json.Decode.field "count" Json.Decode.int)
                    )
                )

        otherOrientationRequestParser =
            Json.Decode.field "data"
                (Json.Decode.field "otherOrientationRequestCount"
                    (Json.Decode.field "aggregate"
                        (Json.Decode.field "count" Json.Decode.int)
                    )
                )
    in
    Json.Decode.map6 OrientationHomeInfos
        orientedBeneficiaryParser
        unOrientedBeneficiaryParser
        orientationRequestParser
        otherOrientedBeneficiaryParser
        otherUnorientedBeneficiaryParser
        otherOrientationRequestParser


encodeGqlQuery : GqlQuery -> Json.Encode.Value
encodeGqlQuery record =
    Json.Encode.object
        [ ( "query", Json.Encode.string <| record.query )
        , ( "variables", encodeGqlQueryVariables <| record.variables )
        ]


encodeGqlQueryVariables : OrientationInfosVariables -> Json.Encode.Value
encodeGqlQueryVariables record =
    Json.Encode.object
        [ ( "id", Json.Encode.string <| record.id )
        ]


getOrientationHomeInfos : Token -> String -> String -> (Result Http.Error OrientationHomeInfos -> msg) -> Cmd msg
getOrientationHomeInfos token serverUrl accountId toMsg =
    let
        gqlQuery =
            { query = """
query GetBeneficiaryDashboard($id: uuid!) {
  unorientedBeneficiaryCount: beneficiary_aggregate(where: {
    notebook: {
      members: {accountId: {_eq: $id}},
      notebookInfo: {needOrientation: {_eq: true}}
    }}) {
    aggregate {
      count
    }
  }
  orientedBeneficiaryCount: beneficiary_aggregate(where: {
    notebook: {
      members: {accountId: {_eq: $id}},
      _not: {notebookInfo: {needOrientation: {_eq: true}}}
    }}) {
    aggregate {
      count
    }
  }
  orientationRequestCount: beneficiary_aggregate( where: {
    orientationRequest: { decided_orientation_type_id: { _is_null: true } }
    }) {
    aggregate {
      count
    }
  }
  otherUnorientedBeneficiaryCount: beneficiary_aggregate(where: {
    notebook: {
      _and: [
        {notebookInfo: {needOrientation: {_eq: true}}},
        {_not: {members: {accountId: {_eq: $id}}}}
      ]
    }}) {
    aggregate {
      count
    }
  }
  otherOrientedBeneficiaryCount: beneficiary_aggregate(where: {
    notebook: {
      _and: [
        {_not: {notebookInfo: {needOrientation: {_eq: true}}}},
        {_not: {members: {accountId: {_eq: $id}}}}
      ]
    }}) {
    aggregate {
      count
    }
  }
  otherOrientationRequestCount: beneficiary_aggregate( where: {
      notebook: { _not: { members: { accountId: { _eq: $id } } } }
      orientationRequest: { decided_orientation_type_id: { _is_null: true } }
    }) {
    aggregate {
      count
    }
  }
}
      """
            , variables = { id = accountId }
            }
    in
    Http.request
        { method = "POST"
        , headers = [ Http.header "authorization" ("Bearer " ++ token) ]
        , url = serverUrl
        , body = Http.jsonBody (encodeGqlQuery gqlQuery)
        , expect = Http.expectJson toMsg orientationHomeInfoDecoder
        , timeout = Nothing
        , tracker = Nothing
        }


main : Program Flags Model Msg
main =
    Browser.element
        { init = init
        , view = view
        , update = update
        , subscriptions = subscriptions
        }


init : Flags -> ( Model, Cmd Msg )
init flags =
    let
        model =
            { token = flags.token, serverUrl = flags.serverUrl, accountId = flags.accountId, orientationHomeInfos = Nothing }
    in
    ( model
    , getOrientationHomeInfos model.token
        model.serverUrl
        model.accountId
        HomeInfosResult
    )


subscriptions : Model -> Sub Msg
subscriptions _ =
    Sub.none


update : Msg -> Model -> ( Model, Cmd Msg )
update msg model =
    case msg of
        HomeInfosResult result ->
            case result of
                Ok infos ->
                    ( { model | orientationHomeInfos = Just infos }, Cmd.none )

                Err _ ->
                    ( model, Cmd.none )


view : Model -> Html Msg
view model =
    let
        extractString : (OrientationHomeInfos -> Int) -> String
        extractString accessor =
            Maybe.withDefault "--" (Maybe.map (accessor >> String.fromInt) model.orientationHomeInfos)

        extractInt : (OrientationHomeInfos -> Int) -> Int
        extractInt accessor =
            Maybe.withDefault 0 (Maybe.map accessor model.orientationHomeInfos)

        -- -- For educational purpose, same as above
        -- extractIntCase : (OrientationHomeInfos -> Int) -> Int
        -- extractIntCase accessor =
        --     case model.orientationHomeInfos of
        --         Just orientationHomeInfos ->
        --             accessor orientationHomeInfos
        --         Nothing ->
        --             0
    in
    div [ class "flex flex-col gap-4" ]
        [ h2 [ class "fr-h4 text-france-blue" ]
            [ text "Mon portefeuille  d'orientation" ]
        , div
            [ class "fr-grid-row fr-grid-row--gutters" ]
            [ card "Bénéficiaires orientés"
                "Liste des bénéficiaires orientés"
                "/orientation/beneficiaires?oriente=oui&brsa=suivi"
                (extractString .nbOriented)
            , card "Bénéficiaires à orienter"
                "Liste des bénéficiaires à orienter"
                "/orientation/beneficiaires?oriente=non&brsa=suivi"
                (extractString .nbUnoriented)
            , if extractInt .nbOrientationRequest > 0 then
                card "Demandes de réorientation"
                    "Liste des demandes de réorientation"
                    "/orientation/demandes?brsa=suivi"
                    (extractString .nbOrientationRequest)

              else
                text ""
            ]
        , h2 [ class "fr-h4 text-france-blue" ]
            [ text "Autres bénéficiaires de mon territoire" ]
        , div
            [ class "fr-grid-row fr-grid-row--gutters" ]
            [ card "Bénéficiaires orientés"
                "Liste des autres bénéficiaires orientés"
                "/orientation/beneficiaires?oriente=oui&brsa=non-suivi"
                (extractString .nbOtherOriented)
            , card "Bénéficiaires à orienter"
                "Liste des autres bénéficiaires à orienter"
                "/orientation/beneficiaires?oriente=non&brsa=non-suivi"
                (extractString .nbOtherUnoriented)
            , if extractInt .nbOtherOrientationRequest > 0 then
                card "Demandes de réorientation"
                    "Liste des autres demandes de réorientation"
                    "/orientation/demandes?brsa=non-suivi"
                    (extractString .nbOrientationRequest)

              else
                text ""
            ]
        ]


card : String -> String -> String -> String -> Html msg
card label cardTitle url value =
    div [ class "fr-col-sm-6 fr-col-md-4 fr-col-lg-4" ]
        [ div
            [ class "fr-card fr-enlarge-link"
            ]
            [ div
                [ class "fr-card__body"
                ]
                [ div
                    [ class "fr-card__content"
                    ]
                    [ h3
                        [ class "fr-card__title"
                        ]
                        [ a
                            [ href url
                            , title cardTitle
                            ]
                            [ text value ]
                        ]
                    , p
                        [ class "fr-card__desc"
                        ]
                        [ text label ]
                    ]
                ]
            , div
                [ class "fr-card__header"
                ]
                []
            ]
        ]
