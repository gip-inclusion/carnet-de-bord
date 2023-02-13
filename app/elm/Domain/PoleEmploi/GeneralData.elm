module Domain.PoleEmploi.GeneralData exposing (..)

import Date exposing (Date)


type alias GeneralData =
    { mrechAxetravailprincipal : Maybe String
    , mrechAxetravailsecondaire : Maybe String
    , dateInscription : Maybe Date
    , motifInscription : Maybe String
    , dateDerEntretienPpae : Maybe Date
    }
