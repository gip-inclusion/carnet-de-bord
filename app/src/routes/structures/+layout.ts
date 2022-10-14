import type { LayoutLoad } from './$types';

export const load: LayoutLoad = async ({ parent }) => {
	const accountId = (await parent()).user;

	return {
		accountId,
	};
};
