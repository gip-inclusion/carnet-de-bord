import { getFilter } from '$lib/ui/BeneficiaryList/Filters.svelte';
import type { PageLoad } from './$types';

export const load: PageLoad = async ({ url }) => {
	const params = url.searchParams;
	return {
		currentPage: parseInt(params.get('page') || '1', 10),
		filter: getFilter(params.get('filter')),
		search: params.get('search') || '',
		member: params.get('member'),
	};
};
