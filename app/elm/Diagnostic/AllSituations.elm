module Diagnostic.AllSituations exposing
    ( PersonalSituation
    , fetchByNotebookId
    , syncWithPE
    )

import Diagnostic.GetSituationsByNotebookId
import Diagnostic.SyncWithPE
import Domain.Account
import Extra.GraphQL
import Time



-- Synchronize


syncWithPE : String -> (Result String Bool -> msg) -> Cmd msg
syncWithPE notebookId responseMsg =
    Extra.GraphQL.postOperation
        (Diagnostic.SyncWithPE.mutation { notebookId = notebookId })
        (Result.map
            (.refresh_notebook_situations_from_pole_emploi
                >> Maybe.map .data_has_been_updated
                >> Maybe.withDefault False
            )
            >> Result.mapError (always "graphql error!")
            >> responseMsg
        )



-- Fetch


type alias PersonalSituation =
    { theme : String
    , description : String
    , createdAt : Time.Posix
    , creator : Maybe Domain.Account.Account
    }


toDomainAccount : Diagnostic.GetSituationsByNotebookId.Account -> Domain.Account.Account
toDomainAccount { orientation_manager, professional } =
    { orientation_manager =
        orientation_manager
            |> Maybe.map
                (\om ->
                    { firstname = Maybe.withDefault "" om.firstname
                    , lastname = Maybe.withDefault "" om.lastname
                    }
                )
    , professional =
        professional
            |> Maybe.map
                (\pro ->
                    { firstname = pro.firstname
                    , lastname = pro.lastname
                    , structure = Just { name = pro.structure.name }
                    }
                )
    }


fetchByNotebookId : String -> (Result String (List PersonalSituation) -> msg) -> Cmd msg
fetchByNotebookId notebookId responseMsg =
    Extra.GraphQL.postOperation
        (Diagnostic.GetSituationsByNotebookId.query { notebookId = notebookId })
        (Result.map
            (.situations
                >> List.map
                    (\situation ->
                        { creator =
                            situation.creator
                                |> Maybe.map toDomainAccount
                        , createdAt =
                            situation.createdAt
                        , description =
                            situation.refSituation
                                |> Maybe.map .description
                                |> Maybe.withDefault ""
                        , theme =
                            situation.refSituation
                                |> Maybe.map .theme
                                |> Maybe.withDefault ""
                        }
                    )
            )
            >> Result.mapError (always "graphql error!")
            >> responseMsg
        )
