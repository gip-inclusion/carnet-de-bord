module Diagnostic.GetSituation exposing (accountSelector, citextToString, createdAtSelector, creatorSelector, orientationManagerSelector, professionalSelector, refSituationSelector, situationSelector, situationSelector2, structureSelector)

import CdbGQL.Object
import CdbGQL.Object.Account
import CdbGQL.Object.Notebook_situation
import CdbGQL.Object.Orientation_manager
import CdbGQL.Object.Professional
import CdbGQL.Object.Ref_situation
import CdbGQL.Object.Structure
import CdbGQL.Query
import CdbGQL.Scalar
import Date exposing (Date)
import Diagnostic.Main exposing (PersonalSituation)
import Domain.Account exposing (Account, OrientationManager, Professional)
import Domain.Structure exposing (Structure)
import Extra.Date exposing (timestampzToDate)
import Graphql.Operation exposing (RootQuery)
import Graphql.SelectionSet as SelectionSet exposing (SelectionSet)


situationSelector : String -> SelectionSet (List PersonalSituation) RootQuery
situationSelector notebookId =
    CdbGQL.Query.notebook_situation { where_ = { notebookId = { eq_ = notebookId } } }
        situationSelector2


situationSelector2 : SelectionSet PersonalSituation CdbGQL.Object.Notebook_situation
situationSelector2 =
    SelectionSet.map4 PersonalSituation
        |> SelectionSet.with CdbGQL.Object.Ref_situation.theme
        |> SelectionSet.with CdbGQL.Object.Ref_situation.description
        |> SelectionSet.with createdAtSelector
        |> SelectionSet.with (CdbGQL.Object.Notebook_situation.creator creatorSelector)


refSituationSelector : SelectionSet ( String, String ) CdbGQL.Object.Ref_situation
refSituationSelector =
    SelectionSet.map2 Tuple.pair
        |> SelectionSet.with CdbGQL.Object.Ref_situation.theme
        |> SelectionSet.with CdbGQL.Object.Ref_situation.description


createdAtSelector : SelectionSet String CdbGQL.Object.Notebook_situation
createdAtSelector =
    CdbGQL.Object.Notebook_situation.createdAt |> SelectionSet.map (\(CdbGQL.Scalar.Timestamptz date) -> date)


creatorSelector : SelectionSet (Maybe Account) CdbGQL.Object.Notebook_situation
creatorSelector =
    CdbGQL.Object.Notebook_situation.creator accountSelector


accountSelector : SelectionSet Account CdbGQL.Object.Account
accountSelector =
    SelectionSet.succeed Account
        |> SelectionSet.with
            (CdbGQL.Object.Account.professional professionalSelector)
        |> SelectionSet.with
            (CdbGQL.Object.Account.orientation_manager orientationManagerSelector)


orientationManagerSelector : SelectionSet OrientationManager CdbGQL.Object.Orientation_manager
orientationManagerSelector =
    SelectionSet.succeed OrientationManager
        |> SelectionSet.with (SelectionSet.withDefault "" CdbGQL.Object.Orientation_manager.firstname)
        |> SelectionSet.with (SelectionSet.withDefault "" CdbGQL.Object.Orientation_manager.lastname)


professionalSelector : SelectionSet Professional CdbGQL.Object.Professional
professionalSelector =
    SelectionSet.succeed Professional
        |> SelectionSet.with CdbGQL.Object.Professional.firstname
        |> SelectionSet.with CdbGQL.Object.Professional.lastname
        |> SelectionSet.with (CdbGQL.Object.Professional.structure structureSelector |> SelectionSet.map Just)


structureSelector : SelectionSet Structure CdbGQL.Object.Structure
structureSelector =
    SelectionSet.succeed Structure
        |> SelectionSet.with (CdbGQL.Object.Structure.name |> SelectionSet.map citextToString)


citextToString : CdbGQL.Scalar.Citext -> String
citextToString (CdbGQL.Scalar.Citext raw) =
    raw
