import { baseUrlForRole } from '$lib/routes';
import { account } from '$lib/stores';
import { redirect } from '@sveltejs/kit';
import { get } from 'svelte/store';
import type { LayoutLoad } from './$types';

export const load: LayoutLoad = async ({ url }) => {
	const accountInfo = get(account);
	if (accountInfo && !accountInfo.onboardingDone && !/bienvenue/.test(url.pathname)) {
		throw redirect(302, `${baseUrlForRole(accountInfo.type)}/moncompte`);
	}
};
