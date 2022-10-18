import type { PageLoad, PageParentData } from './$types';

export const load: PageLoad = async ({ parent, params }) => {
	const parentData: PageParentData = await parent();
	console.log('++++', { parentData, params });
	return {
		deploymentId: params.uuid,
	};
};
