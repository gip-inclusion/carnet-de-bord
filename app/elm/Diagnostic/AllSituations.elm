module Diagnostic.AllSituations exposing
    ( DataSyncInfo
    , PersonalSituation
    , fetchByNotebookId
    , syncWithPE
    )

import Diagnostic.GetSituationsByNotebookId
import Diagnostic.SyncWithPE
import Domain.Account
import Extra.GraphQL
import GraphQL.Enum.Ref_theme_enum exposing (Ref_theme_enum(..))
import Http
import Maybe
import Time


type alias DataSyncInfo =
    { data_has_been_updated : Bool, has_pe_diagnostic : Bool }



-- Synchronize


syncWithPE : String -> (Result Http.Error DataSyncInfo -> msg) -> Cmd msg
syncWithPE notebookId responseMsg =
    Extra.GraphQL.send
        (Diagnostic.SyncWithPE.mutation { notebookId = notebookId })
        (Result.map
            (.update_notebook_from_pole_emploi
                >> Maybe.map
                    (\data ->
                        { data_has_been_updated = data.data_has_been_updated
                        , has_pe_diagnostic = data.has_pe_diagnostic
                        }
                    )
                >> Maybe.withDefault
                    { data_has_been_updated = False
                    , has_pe_diagnostic = False
                    }
            )
            >> responseMsg
        )



-- Fetch


type alias PersonalSituation =
    { theme : Ref_theme_enum
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


fetchByNotebookId : String -> (Result Http.Error (List PersonalSituation) -> msg) -> Cmd msg
fetchByNotebookId notebookId responseMsg =
    Extra.GraphQL.send
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
                                |> Maybe.withDefault Logement
                        }
                    )
            )
            >> responseMsg
        )
