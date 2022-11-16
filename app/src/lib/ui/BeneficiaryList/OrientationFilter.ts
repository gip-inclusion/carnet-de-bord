export type OrientedStatus = 'oriente';
export type UnorientedStatus = 'non-oriente';

export type OrientedFilter = OrientedStatus | UnorientedStatus;

export function getOrientedFilter(filter: string): OrientedFilter {
	switch (filter) {
		case 'oriente':
		case 'non-oriente':
			return filter;
		default:
			return 'non-oriente';
	}
}

export type MyBeneficiary = 'mes-beneficiaires';
export type OtherBeneficiairy = 'autres-beneficiaires';

export type BeneficiaryFilter = MyBeneficiary | OtherBeneficiairy;

export function getBeneficiaryFilter(filter: string): BeneficiaryFilter {
	switch (filter) {
		case 'mes-beneficiaires':
		case 'autres-beneficiaires':
			return filter;
		default:
			return 'mes-beneficiaires';
	}
}
