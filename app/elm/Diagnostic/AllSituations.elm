module Diagnostic.AllSituations exposing
    ( PersonalSituation
    , fetchByNotebookId
    , refresh
    )

import CdbGQL.InputObject exposing (buildNotebook_situation_bool_exp, buildUuid_comparison_exp)
import CdbGQL.Mutation
import CdbGQL.Object
import CdbGQL.Object.Account as GqlAccount
import CdbGQL.Object.Notebook_situation as GqlSituation
import CdbGQL.Object.Orientation_manager as GqlOrientationManager
import CdbGQL.Object.Professional as GqlProfessional
import CdbGQL.Object.Ref_situation as GqlRefSituation
import CdbGQL.Object.Structure as GqlStructure
import CdbGQL.Object.UpdateNotebookSituationsOutput as Output
import CdbGQL.Query
import CdbGQL.Scalar
import Date exposing (Date)
import DebugView.Graphql exposing (graphqlErrorToString)
import Domain.Account exposing (Account, OrientationManager, Professional)
import Domain.Structure exposing (Structure)
import Extra.Date
import Graphql.Http
import Graphql.Operation exposing (RootMutation, RootQuery)
import Graphql.OptionalArgument exposing (OptionalArgument(..))
import Graphql.SelectionSet as SelectionSet exposing (SelectionSet, nonNullOrFail)


type alias PersonalSituation =
    { theme : String
    , description : String
    , createdAt : Date
    , creator : Maybe Account
    }


fetchByNotebookId : String -> (Result String (List PersonalSituation) -> msg) -> Cmd msg
fetchByNotebookId notebookId responseMsg =
    selectSituationsBy notebookId
        |> Graphql.Http.queryRequest "/graphql"
        |> Graphql.Http.send (Result.mapError graphqlErrorToString >> responseMsg)


selectSituationsBy : String -> SelectionSet (List PersonalSituation) RootQuery
selectSituationsBy notebookId =
    CdbGQL.Query.notebook_situation (findBy notebookId) situationSelector



-- filter


findBy :
    String
    -> CdbGQL.Query.NotebookSituationOptionalArguments
    -> CdbGQL.Query.NotebookSituationOptionalArguments
findBy id args =
    { args | where_ = Present (notebookIdEq id) }


notebookIdEq : String -> CdbGQL.InputObject.Notebook_situation_bool_exp
notebookIdEq notebookId =
    buildNotebook_situation_bool_exp
        (\args ->
            { args | notebookId = Present (eq notebookId) }
        )


eq : String -> CdbGQL.InputObject.Uuid_comparison_exp
eq notebookId =
    buildUuid_comparison_exp
        (\comparison ->
            { comparison | eq_ = Present <| CdbGQL.Scalar.Uuid notebookId }
        )



-- selectors


situationSelector : SelectionSet PersonalSituation CdbGQL.Object.Notebook_situation
situationSelector =
    SelectionSet.succeed PersonalSituation
        |> SelectionSet.with (GqlSituation.refSituation GqlRefSituation.theme |> SelectionSet.nonNullOrFail)
        |> SelectionSet.with (GqlSituation.refSituation GqlRefSituation.description |> SelectionSet.nonNullOrFail)
        |> SelectionSet.with createdAtSelector
        |> SelectionSet.with creatorSelector


createdAtSelector : SelectionSet Date CdbGQL.Object.Notebook_situation
createdAtSelector =
    GqlSituation.createdAt |> SelectionSet.mapOrFail Extra.Date.timestampzToDate


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


refresh : String -> (Result String Bool -> msg) -> Cmd msg
refresh notebookId responseMsg =
    selectResult notebookId
        |> Graphql.Http.mutationRequest "/graphql"
        |> Graphql.Http.send (Result.mapError graphqlErrorToString >> responseMsg)


selectResult : String -> SelectionSet Bool RootMutation
selectResult notebookId =
    CdbGQL.Mutation.update_notebook_situations
        { notebookId = CdbGQL.Scalar.Uuid notebookId }
        Output.data_has_been_updated
        |> nonNullOrFail
