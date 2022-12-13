import type { PageLoad } from './$types';

export const dt = {
	none: 'none',
	'3months': '3months',
	'3-6months': '3-6months',
	'6-12months': '6-12months',
	'12months': '12months',
};

export const load: PageLoad = async ({ url }) => {
	const search = url.searchParams.get('search');

	let selected = dt.none;
	if (url.searchParams.get('dt') && dt[url.searchParams.get('dt')]) {
		selected = dt[url.searchParams.get('dt')];
	}

	return { search, selected };
};
