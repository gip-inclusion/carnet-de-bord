import { baseUrlForRole } from '$lib/routes';
import { account, connectedUser } from '$lib/stores';
import { getFilter } from '$lib/ui/BeneficiaryList/Filters.svelte';
import { redirect } from '@sveltejs/kit';
import { get } from 'svelte/store';
import type { PageLoad } from './$types';

export const load: PageLoad = async (event) => {
	const accountInfo = get(account);
	if (accountInfo && !accountInfo.onboardingDone && !/bienvenue/.test(event.url.pathname)) {
		throw redirect(302, `${baseUrlForRole(get(connectedUser).role)}/bienvenue`);
	}

	const params = event.url.searchParams;

	return {
		currentPage: parseInt(params.get('page') || '1', 10),
		filter: getFilter(params.get('filter')),
		search: params.get('search') || '',
		member: params.get('member'),
	};
};
