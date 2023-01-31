export type AllOriented = 'tous';
export type OrientedStatus = 'referent';
export type WithoutReferentStatus = 'sans-referent';
export type UnorientedStatus = 'sans-structure';
export type OrientationRequest = 'demande-reo';

export type OrientedFilter =
	| AllOriented
	| OrientedStatus
	| WithoutReferentStatus
	| UnorientedStatus
	| OrientationRequest;

export function getOrientedFilter(filter: string): OrientedFilter {
	switch (filter) {
		case 'tous':
		case 'referent':
		case 'sans-referent':
		case 'sans-structure':
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
