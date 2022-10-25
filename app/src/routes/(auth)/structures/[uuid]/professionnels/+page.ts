import { getFilter } from '$lib/ui/ProfessionalList/Filters.svelte';
import type { PageLoad } from './$types';

export const load: PageLoad = async ({ params, url }) => {
	const searchParams = url.searchParams;
	const structureId = params.uuid;
	return {
		structureId,
		filter: getFilter(searchParams.get('filter')),
	};
};
