module Domain.Rights exposing (Rights, rsaRightKeyToString)


type alias Rights =
    { rightAre : Bool
    , rightAss : Bool
    , rightBonus : Bool
    , rightRsa : Maybe String
    }


rsaRightKeyToString : String -> String
rsaRightKeyToString key =
    "RSA - "
        ++ (case key of
                "rsa_droit_ouvert_et_suspendu" ->
                    "Droit ouvert et suspendu"

                "rsa_droit_ouvert_versable" ->
                    "Droit ouvert et versable"

                "rsa_droit_ouvert_versement_suspendu" ->
                    "Droit ouvert mais versement suspendu"

                _ ->
                    "Droit non renseigné"
           )
