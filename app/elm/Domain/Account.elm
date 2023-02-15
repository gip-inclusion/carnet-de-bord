module Domain.Account exposing (Account, OrientationManager, Professional)

import Domain.Structure exposing (Structure)


type alias Professional =
    { firstname : String
    , lastname : String
    , structure : Maybe Structure
    }


type alias OrientationManager =
    { firstname : String
    , lastname : String
    }


type alias Account =
    { professional : Maybe Professional
    , orientation_manager : Maybe OrientationManager
    }
