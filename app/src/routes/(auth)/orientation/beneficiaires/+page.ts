import {
	type BeneficiaryFilter,
	getBeneficiaryFilter,
	getOrientedFilter,
	type OrientedFilter,
} from '$lib/ui/BeneficiaryList/OrientationFilter';
import type { PageLoad } from './$types';
import {
	FOLLOWED_BRSA_PARAM_NAME,
	ORIENTATION_STATUS_PARAM_NAME,
	RSA_RIGHT_AND_DUTY_PARAM_NAME,
	WITH_ORIENTATION_MANAGER_PARAM_NAME,
} from './url_params';

export const load: PageLoad = async (event) => {
	const params = event.url.searchParams;
	const beneficiaryFilter: BeneficiaryFilter = getBeneficiaryFilter(
		params.get(FOLLOWED_BRSA_PARAM_NAME)
	);
	const orientationStatusFilter: OrientedFilter = getOrientedFilter(
		params.get(ORIENTATION_STATUS_PARAM_NAME)
	);
	let withoutOrientationManager = false;
	let rsaRightAndDuty = false;

	if (params.get(WITH_ORIENTATION_MANAGER_PARAM_NAME) === 'avec') {
		withoutOrientationManager = true;
	}
	if (params.get(RSA_RIGHT_AND_DUTY_PARAM_NAME) === 'oui') {
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
