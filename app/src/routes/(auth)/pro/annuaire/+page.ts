import type { PageLoad } from './$types';

export const load: PageLoad = async ({ url }) => {
	const search = url.searchParams.get('search');

	return { search };
};
