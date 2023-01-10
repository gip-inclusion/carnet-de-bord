import type { PageLoad } from './$types';

export const load: PageLoad = ({ params }) => {
	return {
		structureId: params.structure_id,
	};
};
