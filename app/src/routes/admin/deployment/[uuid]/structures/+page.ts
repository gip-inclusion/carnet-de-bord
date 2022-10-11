import type { PageLoad } from '@sveltejs/kit';

export const load: PageLoad = ({ params }) => {
	const deploymentId = params.uuid;
	return {
		deploymentId,
	};
};
