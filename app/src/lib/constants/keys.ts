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
});

export const rsaRightKeys = buildKeys({
	rsa_droit_ouvert_et_suspendu: 'Droit ouvert et suspendu',
	rsa_droit_ouvert_versable: 'Droit ouvert et versable',
	rsa_droit_ouvert_versement_suspendu: 'Droit ouvert mais versement suspendu',
	null: 'Droit non renseigné',
	rsa_demande_en_attente:
		'Nouvelle demande en attente de décision du Conseil départemental pour ouverture du droit',
	rsa_refuse: 'Droit refusé',
	rsa_clot: 'Droit clos',
	rsa_clot_anterieur:
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
