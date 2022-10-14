import type { PageLoad } from './$types';

export const load: PageLoad = async (event) => {
	const parentData = await event.parent();

	return {
		accountId: parentData.user.accountId,
	};
};
