import type { LayoutLoad } from './$types';

export const load: LayoutLoad = async (event) => {
	const user = (await event.parent()).user;

	return {
		accountId: user.accountId,
	};
};
