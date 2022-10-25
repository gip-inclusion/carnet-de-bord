import type { PageLoad } from './$types';

export const load: PageLoad = ({ params }) => {
	const structureId = params.uuid;

	return {
		structureId,
	};
};
