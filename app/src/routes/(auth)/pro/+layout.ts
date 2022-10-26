import { baseUrlForRole } from '$lib/routes';
import { redirect } from '@sveltejs/kit';
import type { LayoutLoad } from './$types';

export const load: LayoutLoad = async ({ parent, url }) => {
	const parentData = await parent();
	if (!parentData.account.onboardingDone && !/bienvenue/.test(url.pathname)) {
		throw redirect(302, `${baseUrlForRole(parentData.account.type)}/bienvenue`);
	}
};
