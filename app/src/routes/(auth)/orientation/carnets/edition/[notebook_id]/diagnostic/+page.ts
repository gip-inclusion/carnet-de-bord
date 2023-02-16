import type { PageLoad } from './$types';

export const load: PageLoad = ({ params }) => {
	const notebookId = params.notebook_id;

	return {
		notebookId,
	};
};
