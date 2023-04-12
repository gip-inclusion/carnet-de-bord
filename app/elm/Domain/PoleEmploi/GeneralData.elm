module Domain.PoleEmploi.GeneralData exposing (GeneralData)

import Date exposing (Date)


type alias GeneralData =
    { mrechAxetravailprincipal : Maybe String
    , mrechAxetravailsecondaire : Maybe String
    , dateInscription : Maybe Date
    , motifInscription : Maybe String
    , dateDerEntretienPpae : Maybe Date
    }
