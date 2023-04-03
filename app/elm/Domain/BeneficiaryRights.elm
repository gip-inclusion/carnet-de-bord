module Domain.BeneficiaryRights exposing (BeneficiaryRights, rsaRightKeyToString)


type alias BeneficiaryRights =
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

                "rsa_demande_en_attente" ->
                    "Nouvelle demande en attente de décision du Conseil départemental pour ouverture du droit"

                "rsa_refuse" ->
                    "Droit refusé"

                "rsa_clot" ->
                    "Droit clos"

                "rsa_clot_anterieur" ->
                    "Droit clos sur mois antérieur ayant eu un contrôle dans le mois de référence pour une période antérieure."

                _ ->
                    "Droit non renseigné"
           )
