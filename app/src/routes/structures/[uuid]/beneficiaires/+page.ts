import type { PageLoad } from '@sveltejs/kit';

export const load: PageLoad = async ({ params, url }) => {
	const searchParams = url.searchParams;
	const structureId = params.uuid;
	return {
		structureId,
		currentPage: parseInt(searchParams.get('page') ?? '1', 10),
		filter: getFilter(searchParams.get('filter')),
		search: searchParams.get('search') ?? '',
		member: searchParams.get('member'),
	};
};
