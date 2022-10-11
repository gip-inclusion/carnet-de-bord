import type { PageLoad } from '@sveltejs/kit';
import { getFilter } from '$lib/ui/ProfessionalList/Filters.svelte';

export const load: PageLoad = async ({ params, url }) => {
	const searchParams = url.searchParams;
	const structureId = params.uuid;
	return {
		structureId,
		filter: getFilter(searchParams.get('filter')),
	};
};
