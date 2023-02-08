module Domain.PoleEmploi.PrincipalData exposing (..)

import Date exposing (Date)


type alias PrincipalData =
    { mrechAxetravailprincipal : Maybe String
    , mrechAxetravailsecondaire : Maybe String
    , dateInscription : Maybe Date
    , motifInscription : Maybe String
    , dateDerEntretienPpae : Maybe Date
    }
