module Diagnostic.Main exposing (Flags, Model, Msg, main)

import Browser
import Diagnostic.PersonalSituation
import Diagnostic.ProfessionalProject exposing (ProjectFlag)
import Diagnostic.SocioPro exposing (PeFlags, ProfessionalSituationFlags)
import Domain.ProfessionalProject exposing (ProfessionalProject)
import Html
import Html.Attributes as Attr
import Platform.Cmd as Cmd
import Url.Builder as Url


type alias Flags =
    { professionalSituation : ProfessionalSituationFlags
    , peGeneralData : Maybe PeFlags
    , professionalProjects : List ProjectFlag
    , notebookId : String
    }


main : Program Flags Model Msg
main =
    Browser.element
        { init = init
        , view = view
        , update = update
        , subscriptions = \_ -> Sub.none
        }



-- MODEL


type alias Model =
    { socioPro : Diagnostic.SocioPro.Model
    , professionalProjects : List ProfessionalProject
    , personalSituation : Diagnostic.PersonalSituation.Model
    }


init : Flags -> ( Model, Cmd Msg )
init flags =
    let
        ( personalSituation, personalSituationCmd ) =
            Diagnostic.PersonalSituation.init { notebookId = flags.notebookId }
    in
    ( { socioPro =
            Diagnostic.SocioPro.init
                { professionalSituation = flags.professionalSituation
                , peGeneralData = flags.peGeneralData
                }
      , professionalProjects = Diagnostic.ProfessionalProject.init flags.professionalProjects
      , personalSituation = personalSituation
      }
    , Cmd.map PersonalSituationMsg personalSituationCmd
    )



-- UPDATE


type Msg
    = PersonalSituationMsg Diagnostic.PersonalSituation.Msg


update : Msg -> Model -> ( Model, Cmd Msg )
update msg model =
    case msg of
        PersonalSituationMsg subMsg ->
            let
                ( next, cmd ) =
                    Diagnostic.PersonalSituation.update subMsg model.personalSituation
            in
            ( { model | personalSituation = next }, Cmd.map PersonalSituationMsg cmd )



-- VIEW


view : Model -> Html.Html msg
view model =
    Html.div [ Attr.class "mb-10 grid gap-4" ]
        [ if model.personalSituation.has_pe_diagnostic then
            Html.a
                [ Attr.href (Url.absolute [ "carnet", model.personalSituation.notebookId, "diagnostic-france-travail" ] [])
                , Attr.class "fr-btn fr-btn--secondary"
                ]
                [ Html.text "Consulter le diagnostic France Travail"
                ]

          else
            Html.text ""
        , Diagnostic.SocioPro.view model.socioPro
        , Diagnostic.ProfessionalProject.view model.professionalProjects
        , Diagnostic.PersonalSituation.view model.personalSituation
        ]
