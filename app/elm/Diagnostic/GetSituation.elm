module Diagnostic.GetSituation exposing
    ( accountSelector
    , citextToString
    , createdAtSelector
    , creatorSelector
    , fetchSituation
    , orientationManagerSelector
    , professionalSelector
    , situationsSelector
    , structureSelector
    )

import CdbGQL.InputObject exposing (buildNotebook_situation_bool_exp, buildUuid_comparison_exp)
import CdbGQL.Object
import CdbGQL.Object.Account as GqlAccount
import CdbGQL.Object.Notebook_situation as GqlSituation
import CdbGQL.Object.Orientation_manager as GqlOrientationManager
import CdbGQL.Object.Professional as GqlProfessional
import CdbGQL.Object.Ref_situation as GqlRefSituation
import CdbGQL.Object.Structure as GqlStructure
import CdbGQL.Query
import CdbGQL.Scalar
import DebugView.Graphql exposing (graphqlErrorToString)
import Diagnostic.Main exposing (PersonalSituation)
import Domain.Account exposing (Account, OrientationManager, Professional)
import Domain.Structure exposing (Structure)
import Graphql.Http
import Graphql.Operation exposing (RootQuery)
import Graphql.OptionalArgument exposing (OptionalArgument(..))
import Graphql.SelectionSet as SelectionSet exposing (SelectionSet)


fetchSituation : { id : String, responseMsg : Result String (List PersonalSituation) -> msg } -> Cmd msg
fetchSituation { id, responseMsg } =
    situationsSelector id
        |> Graphql.Http.queryRequest "/graphql"
        |> Graphql.Http.send (Result.mapError graphqlErrorToString >> responseMsg)


situationsSelector : String -> SelectionSet (List PersonalSituation) RootQuery
situationsSelector notebookId =
    CdbGQL.Query.notebook_situation
        (findBy notebookId)
        -- { where_ = { notebookId = { eq_ = notebookId } } }
        situationSelector


findBy : String -> (CdbGQL.Query.NotebookSituationOptionalArguments -> CdbGQL.Query.NotebookSituationOptionalArguments)
findBy notebookId args =
    { args
        | where_ =
            Present
                (buildNotebook_situation_bool_exp
                    (\stuff ->
                        { stuff
                            | notebookId =
                                Present
                                    (buildUuid_comparison_exp
                                        (\s2 ->
                                            { s2 | eq_ = Present <| CdbGQL.Scalar.Uuid notebookId }
                                        )
                                    )
                        }
                    )
                )
    }


situationSelector : SelectionSet PersonalSituation CdbGQL.Object.Notebook_situation
situationSelector =
    SelectionSet.succeed PersonalSituation
        |> SelectionSet.with (GqlSituation.refSituation GqlRefSituation.theme |> SelectionSet.nonNullOrFail)
        |> SelectionSet.with (GqlSituation.refSituation GqlRefSituation.description |> SelectionSet.nonNullOrFail)
        |> SelectionSet.with createdAtSelector
        |> SelectionSet.with creatorSelector


createdAtSelector : SelectionSet String CdbGQL.Object.Notebook_situation
createdAtSelector =
    GqlSituation.createdAt |> SelectionSet.map (\(CdbGQL.Scalar.Timestamptz date) -> date)


creatorSelector : SelectionSet (Maybe Account) CdbGQL.Object.Notebook_situation
creatorSelector =
    GqlSituation.creator accountSelector


accountSelector : SelectionSet Account CdbGQL.Object.Account
accountSelector =
    SelectionSet.succeed Account
        |> SelectionSet.with (GqlAccount.professional professionalSelector)
        |> SelectionSet.with (GqlAccount.orientation_manager orientationManagerSelector)


orientationManagerSelector : SelectionSet OrientationManager CdbGQL.Object.Orientation_manager
orientationManagerSelector =
    SelectionSet.succeed OrientationManager
        |> SelectionSet.with (SelectionSet.withDefault "" GqlOrientationManager.firstname)
        |> SelectionSet.with (SelectionSet.withDefault "" GqlOrientationManager.lastname)


professionalSelector : SelectionSet Professional CdbGQL.Object.Professional
professionalSelector =
    SelectionSet.succeed Professional
        |> SelectionSet.with GqlProfessional.firstname
        |> SelectionSet.with GqlProfessional.lastname
        |> SelectionSet.with (GqlProfessional.structure structureSelector |> SelectionSet.map Just)


structureSelector : SelectionSet Structure CdbGQL.Object.Structure
structureSelector =
    SelectionSet.succeed Structure
        |> SelectionSet.with (GqlStructure.name |> SelectionSet.map citextToString)


citextToString : CdbGQL.Scalar.Citext -> String
citextToString (CdbGQL.Scalar.Citext raw) =
    raw
