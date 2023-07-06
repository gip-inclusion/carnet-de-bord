import { buildKeys } from '$lib/utils/keysBuilder';

// NOTEBOOK KEYS
/* ----------------------------------------------- */

export const workSituationKeys = buildKeys({
	recherche_emploi: "En recherche d'emploi",
	recherche_formation: 'En recherche de formation',
	recherche_alternance: 'En recherche d’alternance',
	recherche_stage: 'En recherche de stage',
	emploi: 'En emploi',
	formation: 'En formation',
	stage: 'En stage',
	alternance: 'En alternance',
	service_civique: 'En service civique',
	iae: 'En IAE',
	interim: 'En interim',
	construction_projet: 'En construction de projet',
	projet_entrepreneurial: 'En projet entrepreneurial',
	entrepreneur: 'Entrepreneur',
	etudiant: 'Etudiant',
	scolarisé: 'Scolarisé',
	enretraite: 'En retraite / pré-retraite',
	maladie: 'Longue maladie',
	invalidite: 'En invalidité de travail',
	conge_parental: 'Congé parental',
	au_foyer: 'Au foyer',
	autre: 'Autre',
	cdi_temps_plein: 'CDI temps complet',
	cdi_temps_partiel: 'CDI temps partiel',
	cdd_temps_plein: 'CDD temps complet',
	cdd_temps_partiel: 'CDD temps partiel',
	intermittent: 'Intermittent du spectacle ',
	aidant_familial: 'Aidant(e) familial(e)',
	exploitant_agricole: 'Exploitante(e) agricole',
});

export const rsaRightKeys = buildKeys({
	rsa_droit_ouvert_et_suspendu: 'Droit ouvert et suspendu',
	rsa_droit_ouvert_versable: 'Droit ouvert et versable',
	rsa_droit_ouvert_versement_suspendu: 'Droit ouvert mais versement suspendu',
	null: 'Droit non renseigné',
	rsa_demande_en_attente:
		'Nouvelle demande en attente de décision du Conseil départemental pour ouverture du droit',
	rsa_refuse: 'Droit refusé',
	rsa_clos: 'Droit clos',
	rsa_clos_anterieur:
		'Droit clos sur mois antérieur ayant eu un contrôle dans le mois de référence pour une période antérieure.',
});

export const contractTypeKeys = buildKeys({
	cej: 'CEJ',
	cer: 'CER',
	ppae: 'PPAE',
	pacea: 'PACEA',
});

export const contractTypeFullKeys = buildKeys({
	cej: "Contrat d'Engagement Jeune (CEJ)",
	cer: "Contrat d'Engagement Réciproque (CER)",
	ppae: "Projet Personnalisé d'Accès à l'Emploi (PPAE)",
	pacea: "Parcours contractualisé d'Accompagnement vers l'Emploi et l'Autonomie (PACEA)",
	no: 'Aucun',
});

export const educationLevelKeys = buildKeys({
	// deprecated
	// level_3: 'Niveau 3: CAP/BEP',
	// level_4: 'Niveau 4: Bac ou équivalent',
	// level_5: 'Niveau 5: Bac +2',
	// level_6: 'Niveau 6: Bac +3 / +4',
	// level_7: 'Niveau 7: Maîtrise / Master / DEA / DESS / DI',
	// level_8: 'Niveau 8: Doctorat / HDR',
	AFS: 'Aucune formation scolaire',
	C12: '2nd ou 1ère achevée',
	C3A: 'BEPC ou 3ème achevée',
	CFG: '4ème achevée',
	CP4: 'Primaire à 4ème',
	NV5: 'CAP, BEP ou équivalent',
	NV4: 'Bac ou équivalent',
	NV3: 'Bac+2 ou équivalent',
	NV2: 'Bac+3, Bac+4 ou équivalent',
	NV1: 'Bac+5 et plus ou équivalent',
});

/* ----------------------------------------------- */
/* ----------------------------------------------- */

// FOCUS KEYS

export const focusThemeKeys = buildKeys({
	logement: 'Logement',
	emploi: 'Emploi',
	formation: 'Formation',
	difficulte_administrative: 'Difficultés administratives',
	difficulte_financiere: 'Difficultés financières',
	mobilite: 'Mobilité',
	sante: 'Santé',
	contraintes_familiales: 'Contraintes familiales',
	maitrise_langue: 'Maîtrise de la langue française',
	numerique: 'Numérique',
});

// Appointments

export const AppointmentsMapping = {
	pending: 'En attente',
	present: 'Présent',
	absent: 'Absent',
};

export const OrientationRequestStatus = {
	pending: 'pending',
	denied: 'denied',
	accepted: 'accepted',
};

export const rsaClosureKeys = buildKeys({
	caf_decision_pcg: 'Clôture suite décision du Président du Conseil général',
	caf_echeance: 'Clôture suite à échéance (4 mois sans droits)',
	caf_annulation_bascule_rmi: "Clôture suite à l'annulation de la bascule RMI/API",
	caf_mutation: 'Clôture suite à mutation du dossier dans un autre organisme',
	caf_regroupement: 'Clôture pour regroupement de dossier',
	caf_radie_fin_droit: 'Radié fin de droit',
	caf_radie_autre_motif: 'Radié autre motif',
	caf_radie_option_rsta: 'Radié option RSTA DOM',
	caf_radie_option_rso: 'Radié option RSO DOM',
});

export const rsaSuspensionKeys = buildKeys({
	caf_ressources_trop_elevees: 'Ressources trop élévées',
	caf_moins_25_sans_personne_charge: 'Moins de 25 ans sans enfant ni autre personne à charge',
	caf_activite_non_conforme: 'Activité non conforme',
	caf_titre_sejour_invalid: 'Titre de séjour non valide',
	caf_rsa_inferieur_seuil: 'RSA inférieur au seuil',
	caf_declaration_ressource_non_fournie: 'Déclaration Trimestrielle Ressources non fournie',
	caf_residence_non_conforme: 'Résidence non conforme',
	caf_pas_isolement: "Pas d'isolement",
	caf_prestation_exclue: 'Prestation exclue affiliation partielle',
	caf_regime_non_conforme: 'Régime non conforme',
	caf_demande_avantage_vieillesse_absent: 'Demande avantage vieillesse absent ou tardif',
	caf_titre_sejour_absent: 'Titre de séjour absent',
	caf_hospitalisation: 'Hospitalisation',
	caf_action_non_engagee: 'Action non engagée',
	caf_surface_ponderee_sup: 'Surface pondérée supérieure au plafond ou inconnue',
	caf_droit_eteint: 'Droit éteint ou autre cas',
	caf_pas_allocataire: "Pas d'allocataire",
	caf_beneficiaire_aah: 'Bénéficiaire AAH réduite',
	caf_allocataire_absent: 'Allocataire absent du foyer',
	caf_attente_decision_PCG: "Attente décision PCG (le droit reste théorique jusqu'au retour)",
	caf_activite_anterieur_insuffisante: 'Activité antérieure insuffisante',
	caf_activite_anterieure_absente: 'Activité antérieure absente',
	caf_etudiant_remuneration_insuffisante: 'Étudiant rémunération insuffisante',
	caf_activite_anterieure_non_conforme: 'Activité antérieure non conforme',
});
