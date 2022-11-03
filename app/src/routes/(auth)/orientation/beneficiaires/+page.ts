import type { BeneficiaryFilter, OrientedFilter } from '$lib/ui/BeneficiaryList/OrientationFilter';
import type { PageLoad } from './$types';

export const load: PageLoad = async (event) => {
	const params = event.url.searchParams;
	let orientationStatusFilter: OrientedFilter = 'non-oriente';
	let withoutOrientationManager = false;
	let beneficiaryFilter: BeneficiaryFilter = 'mes-beneficiaires';

	if (params.get('oriente') === 'oui') {
		orientationStatusFilter = 'oriente';
	}

	if (params.get('co') === 'avec') {
		withoutOrientationManager = true;
	}

	if (params.get('brsa') === 'non-suivi') {
		beneficiaryFilter = 'autres-beneficiaires';
	}

	return {
		currentPage: parseInt(params.get('page') || '1', 10),
		search: params.get('search') || '',
		orientationStatusFilter,
		withoutOrientationManager,
		beneficiaryFilter,
	};
};
