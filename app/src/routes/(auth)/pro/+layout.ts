import { baseUrlForRole } from '$lib/routes';
import { redirect } from '@sveltejs/kit';
import type { LayoutLoad } from './$types';

export const load: LayoutLoad = async ({ parent, url }) => {
	const parentData = await parent();
	if (
		parentData.account &&
		!parentData.account.onboardingDone &&
		!/bienvenue/.test(url.pathname) &&
		!/moncompte/.test(url.pathname)
	) {
		console.log({ parentData, url });
		console.count('pro/layout');
		throw redirect(302, `${baseUrlForRole(parentData.account.type)}/moncompte`);
	}
};
