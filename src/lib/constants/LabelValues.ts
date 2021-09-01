import type { LabelValue } from '$lib/types';

export const cerObjectLabelValue: LabelValue[] = [
	{ label: 'Emploi', value: 'emploi' },
	{ label: 'Formation', value: 'formation' },
	{ label: 'Logement', value: 'logement' },
	{ label: 'Autonomie sociale', value: 'autonomie_sociale' },
	{ label: 'Santé', value: 'sante' }
];

export const rightLabelValue: LabelValue[] = [
	{ label: 'RQTH', value: 'rqth' },
	{ label: 'ARE', value: 'are' },
	{ label: 'ASS', value: 'ass' },
	{ label: 'Prime d’activité', value: 'prime_activite' },
	{ label: 'RSA_ Droit ouvert et suspendu', value: 'rsa_droit_ouvert_et_suspendu' },
	{ label: 'RSA_Droit ouvert et versable', value: 'rsa_droit_ouvert_versable' },
	{
		label: 'RSA_Droit ouvert mais versement suspendu',
		value: 'rsa_droit_ouvert_versement_suspendu'
	}
];

export const workSituationLabelValue: LabelValue[] = [
	{ label: 'En recherche d’emploi', value: 'recherche_emploi' },
	{ label: 'En recherche de formation', value: 'recherche_formation' },
	{ label: 'En recherche d’alternance', value: 'recherche_alternance' },
	{ label: 'En recherche de stage', value: 'recherche_stage' },
	{ label: 'En emploi', value: 'emploi' },
	{ label: 'En formation', value: 'formation' },
	{ label: 'En stage', value: 'stage' },
	{ label: 'En alternance', value: 'alternance' },
	{ label: 'En service civique', value: 'service_civique' },
	{ label: 'En CDD', value: 'cdd' },
	{ label: 'En CDI', value: 'cdi' },
	{ label: 'En IAE', value: 'iae' },
	{ label: 'En interim', value: 'interim' },
	{ label: 'En construction de projet', value: 'construction_projet' },
	{ label: 'En projet entrepreneurial', value: 'projet_entrepreneurial' },
	{ label: 'Entrepreneur', value: 'entrepreneur' }
];
