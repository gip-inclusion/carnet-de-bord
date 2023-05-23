module Extra.CdbGQL exposing (printUuid)

import CdbGQL.Scalar exposing (Uuid(..))


printUuid : Uuid -> String
printUuid (Uuid value) =
    value
