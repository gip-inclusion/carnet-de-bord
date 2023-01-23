export type AllOriented = 'tous';
export type OrientedStatus = 'oriente';
export type UnorientedStatus = 'non-oriente';

export type OrientedFilter = AllOriented | OrientedStatus | UnorientedStatus;

export function getOrientedFilter(filter: string): OrientedFilter {
	switch (filter) {
		case 'oriente':
		case 'non-oriente':
			return filter;
		default:
			return 'non-oriente';
	}
}

export type AllBeneficiary = 'tous';
export type MyBeneficiary = 'mes-beneficiaires';
export type OtherBeneficiairy = 'autres-beneficiaires';

export type BeneficiaryFilter = AllBeneficiary | MyBeneficiary | OtherBeneficiairy;

export function getBeneficiaryFilter(filter: string): BeneficiaryFilter {
	switch (filter) {
		case 'tous':
		case 'mes-beneficiaires':
		case 'autres-beneficiaires':
			return filter;
		default:
			return 'mes-beneficiaires';
	}
}
