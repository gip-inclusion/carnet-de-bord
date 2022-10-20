import { baseUrlForRole } from '$lib/routes';
import { getFilter } from '$lib/ui/BeneficiaryList/Filters.svelte';
import { redirect } from '@sveltejs/kit';
import type { PageLoad } from './$types';

export const load: PageLoad = async (event) => {
	const parentData = await event.parent();
	if (!parentData.account.onboardingDone && !/bienvenue/.test(event.url.pathname)) {
		throw redirect(302, `${baseUrlForRole(parentData.account.type)}/bienvenue`);
	}

	const params = event.url.searchParams;

	return {
		currentPage: parseInt(params.get('page') || '1', 10),
		filter: getFilter(params.get('filter')),
		search: params.get('search') || '',
		member: params.get('member'),
	};
};
