import {
	type BeneficiaryFilter,
	getBeneficiaryFilter,
	getOrientedFilter,
	type OrientedFilter,
} from '$lib/ui/BeneficiaryList/OrientationFilter';
import type { PageLoad } from './$types';
import { OrientationManagerFilterUrlParameters as filterParams } from './url_params';

export const load: PageLoad = async (event) => {
	const params = event.url.searchParams;
	const beneficiaryFilter: BeneficiaryFilter = getBeneficiaryFilter(
		params.get(filterParams.FollowedBrsa)
	);
	const orientationStatusFilter: OrientedFilter = getOrientedFilter(
		params.get(filterParams.OrientationStatus)
	);
	let withoutOrientationManager = false;
	let rsaRightAndDuty = false;

	if (params.get(filterParams.WithOrientationManager) === 'avec') {
		withoutOrientationManager = true;
	}
	if (params.get(filterParams.RsaRightAndDuty) === 'oui') {
		rsaRightAndDuty = true;
	}
	return {
		currentPage: parseInt(params.get('page') || '1', 10),
		search: params.get('search') || '',
		orientationStatusFilter,
		withoutOrientationManager,
		beneficiaryFilter,
		rsaRightAndDuty,
	};
};
