import { getFilter } from '$lib/ui/BeneficiaryList/Filters.svelte';
import type { PageLoad } from './$types';

export const load: PageLoad = async (event) => {
	const params = event.url.searchParams;
	let need_orientation: boolean | null = null;
	if (params.get('orientation') === 'oui') {
		need_orientation = false;
	} else if (params.get('orientation') === 'non') {
		need_orientation = true;
	}
	return {
		currentPage: parseInt(params.get('page') || '1', 10),
		filter: getFilter(params.get('filter')),
		search: params.get('search') || '',
		member: params.get('member'),
		need_orientation,
	};
};
