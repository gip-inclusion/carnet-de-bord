import { baseUrlForRole } from '$lib/routes';
import { redirect } from '@sveltejs/kit';
import type { LayoutLoad } from './$types';

export const load: LayoutLoad = async (event) => {
	const parentData = await event.parent();
	if (!parentData.account.onboardingDone && !/bienvenue/.test(event.url.pathname)) {
		throw redirect(302, `${baseUrlForRole(parentData.account.type)}/bienvenue`);
	}
};
