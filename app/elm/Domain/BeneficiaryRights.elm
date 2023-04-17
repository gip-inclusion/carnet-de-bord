module Domain.BeneficiaryRights exposing (BeneficiaryRights, ReasonKey, RsaRight(..), closureReasonKeyToString, rsaRightKeyToString, suspensionReasonKeyToString)

import Date exposing (Date)


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


type alias ReasonKey =
    String



-- TODO Rendre les infos (raison, date) obligatoires
-- pour simplifier la gestion de l'affichage


type RsaRight
    = OuvertSuspendu
    | OuvertVersable
    | OuvertVersementSuspendu (Maybe ReasonKey)
    | DemandeEnAttente
    | Refuse
    | Clot (Maybe ReasonKey) (Maybe Date)
    | ClotMoisAnterieur (Maybe ReasonKey) (Maybe Date)


suspensionReasonKeyToString : String -> String
suspensionReasonKeyToString key =
    case key of
        "caf_ressources_trop_eleve" ->
            "Ressources trop élévées"

        "caf_moins_25_sans_enf_personne_charge" ->
            "Moins 25 ans sans enft/autre person. à charge"

        "caf_activite_non_conforme" ->
            "Activité non conforme"

        "caf_titre_sejour_invalid" ->
            "Titre de séjour non valide"

        "caf_rsa_inferieur_seuil" ->
            "RSA inférieur au seuil"

        "caf_declaration_ressource_non_fournie" ->
            "Déclaration Trimestrielle Ressources non fournie"

        "caf_residence_non_conforme" ->
            "Résidence non conforme"

        "caf_pas_isolement" ->
            "Pas d'isolement"

        "caf_prestation_exclue" ->
            "Prestation exclue affil partielle"

        "caf_regime_non_conforme" ->
            "Régime non conforme"

        "caf_demande_avantage_vieillesse_absent" ->
            "Demande avantage vielliesse absent ou tardif"

        "caf_titre_sejour_absent" ->
            "Titre de séjour absent"

        "caf_hospitalisation" ->
            "Hospitalisation"

        "caf_action_non_engagee" ->
            "Action non engagée"

        "caf_surface_ponderee_sup" ->
            "Surface pondérée > plafond ou inconnue"

        "caf_droit_eteins_autre" ->
            "Droit éteint ou autre cas"

        "caf_pas_allocataire" ->
            "Pas d'allocataire"

        "caf_beneficiaire_aah" ->
            "Bénéficiaire AAH réduite"

        "caf_allocataire_absent" ->
            "Allocataire absent du foyer"

        "caf_attente_decision_PCG" ->
            "Attente décision PCG (le droit reste théorique jusqu'au retour)"

        "caf_activite_anterieur_insuffisante" ->
            "Activité antérieure insuffisante"

        "caf_activite_anterieure_absente" ->
            "Activité antérieure absente"

        "caf_etudiant_remuneration_insuffisante" ->
            "Etudiant rémunération insuff."

        "caf_activite_anterieure_non_conforme" ->
            "Activité antérieure non conforme"

        _ ->
            ""


closureReasonKeyToString : String -> String
closureReasonKeyToString key =
    case key of
        "caf_decision_pcg" ->
            "Clôture suite décision du Président du Conseil général"

        "caf_echeance" ->
            "Clôture suite à échéance (4 mois sans droits)"

        "caf_annulation_bascule_rmi" ->
            "Clôture suite à l'annulation de la bascule RMI/API"

        "caf_mutation" ->
            "Clôture suite à mutation du dossier dans un autre organisme"

        "caf_regroupement" ->
            "Clôture pour regroupement de dossier"

        "caf_radie_fin_droit" ->
            "Radié fin de droit"

        "caf_radie_autre_motif" ->
            "Radié autre motif"

        "caf_radie_option_rsta" ->
            "Radié option RSTA Dom"

        "caf_radie_option_rso" ->
            "Radié option RSO Dom"

        _ ->
            ""
