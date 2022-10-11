import NotebookView from '$lib/ui/views/NotebookView.svelte';
import LoaderIndicator from '$lib/ui/utils/LoaderIndicator.svelte';
import type { PageLoad } from '@sveltejs/kit';
import { GetNotebookByIdDocument } from '$lib/graphql/_gen/typed-document-nodes';
import { operationStore, query } from '@urql/svelte';

export const load: PageLoad = ({ params }) => {
	const notebookId = params.notebook_id;

	return {
		notebookId,
	};
};
