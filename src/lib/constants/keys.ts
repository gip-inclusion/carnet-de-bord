import { buildKeys } from '$lib/utils/keysBuilder';

export const focusThemeKeys = buildKeys({
	logement: 'Logement',
	sante: 'Santé',
	contraintes_familiales: 'Contraintes familiales'
});

export const situationKeys = buildKeys({
	sans_hebergement: 'Sans hébergement'
});

export const targetKeys = buildKeys({
	acces_droits: 'Accès Droits',
	recherche_logement: 'Recherche de logement'
});

export const actionKeys = buildKeys({
	demande_domiciliation: 'Demande de domiciliation',
	droit_logement_opposable: 'Droit au logement opposable'
});

export const cerObjectKeys = buildKeys({
	emploi: 'Emploi',
	formation: 'Formation',
	logement: 'Logement',
	autonomie_sociale: 'Autonomie sociale',
	sante: 'Santé'
});

export const rightKeys = buildKeys({
	rqth: 'RQTH',
	are: 'ARE',
	ass: 'ASS',
	rsa_droit_ouvert_et_suspendu: 'RSA_ Droit ouvert et suspendu',
	rsa_droit_ouvert_versable: 'RSA_Droit ouvert et versable',
	rsa_droit_ouvert_versement_suspendu: 'RSA_Droit ouvert mais versement suspendu'
});

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
	cdd: 'En CDD',
	cdi: 'En CDI',
	iae: 'En IAE',
	interim: 'En interim',
	construction_projet: 'En construction de projet',
	projet_entrepreneurial: 'En projet entrepreneurial',
	entrepreneur: 'Entrepreneur'
});
