import type { PageLoad } from './$types';

export const load: PageLoad = ({ params }) => {
	const deploymentId = params.uuid;
	return {
		deploymentId,
	};
};
