import {
	BeneficiaryFilter,
	getBeneficiaryFilter,
	getOrientedFilter,
	OrientedFilter,
} from '$lib/ui/BeneficiaryList/OrientationFilter';
import type { PageLoad } from './$types';

export const load: PageLoad = async (event) => {
	const params = event.url.searchParams;
	const beneficiaryFilter: BeneficiaryFilter = getBeneficiaryFilter(params.get('brsa'));
	const orientationStatusFilter: OrientedFilter = getOrientedFilter(params.get('statut'));
	let withoutOrientationManager = false;

	if (params.get('co') === 'avec') {
		withoutOrientationManager = true;
	}
	return {
		currentPage: parseInt(params.get('page') || '1', 10),
		search: params.get('search') || '',
		orientationStatusFilter,
		withoutOrientationManager,
		beneficiaryFilter,
	};
};
