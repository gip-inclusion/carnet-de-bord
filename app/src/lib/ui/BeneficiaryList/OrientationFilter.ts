export type AllOriented = 'tous';
export type OrientedStatus = 'referent';
export type UnorientedStatus = 'sans-referent';
export type OrientationRequest = 'demande-reo';

export type OrientedFilter = AllOriented | OrientedStatus | UnorientedStatus | OrientationRequest;

export function getOrientedFilter(filter: string): OrientedFilter {
	switch (filter) {
		case 'tous':
		case 'referent':
		case 'sans-referent':
		case 'demande-reo':
			return filter;
		default:
			return 'tous';
	}
}

export type AllBeneficiary = 'tous';
export type MyBeneficiary = 'suivi';
export type OtherBeneficiairy = 'non-suivi';

export type BeneficiaryFilter = AllBeneficiary | MyBeneficiary | OtherBeneficiairy;

export function getBeneficiaryFilter(filter: string): BeneficiaryFilter {
	switch (filter) {
		case 'tous':
		case 'suivi':
		case 'non-suivi':
			return filter;
		default:
			return 'tous';
	}
}
