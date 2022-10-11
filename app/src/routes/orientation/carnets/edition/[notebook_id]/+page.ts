import LoaderIndicator from '$lib/ui/utils/LoaderIndicator.svelte';
import type { PageLoad } from '@sveltejs/kit';
import { GetNotebookDocument } from '$lib/graphql/_gen/typed-document-nodes';
import { operationStore, query } from '@urql/svelte';
import NotebookEdit from '$lib/ui/OrientationManager/NotebookEdit.svelte';

export const load: PageLoad = ({ params }) => {
	const notebookId = params.notebook_id;

	return {
		notebookId,
	};
};
