<script context="module" lang="ts">
	throw new Error(
		'@migration task: Check code was safely removed (https://github.com/sveltejs/kit/discussions/5774#discussioncomment-3292722)'
	);

	// import LoaderIndicator from '$lib/ui/utils/LoaderIndicator.svelte';
	// import type { Load } from '@sveltejs/kit';
	// import { GetNotebookDocument } from '$lib/graphql/_gen/typed-document-nodes';
	// import { operationStore, query } from '@urql/svelte';
	// import NotebookEdit from '$lib/ui/OrientationManager/NotebookEdit.svelte';

	// export const load: Load = ({ params }) => {
	// 	const notebookId = params.notebook_id;

	// 	return {
	// 		props: {
	// 			notebookId,
	// 		},
	// 	};
	// };
</script>

<script lang="ts">
	throw new Error(
		'@migration task: Add data prop (https://github.com/sveltejs/kit/discussions/5774#discussioncomment-3292707)'
	);

	export let notebookId: string;

	const getNotebookResult = operationStore(
		GetNotebookDocument,
		{ id: notebookId },
		{
			additionalTypenames: [
				'beneficiary',
				'notebook_member',
				'wanted_job',
				'notebook_appointment',
				'notebook_focus',
				'notebook_action',
			],
		}
	);

	query(getNotebookResult);
	$: notebook = $getNotebookResult.data?.notebook;
</script>

<LoaderIndicator result={getNotebookResult}>
	<NotebookEdit {notebook} />
</LoaderIndicator>
