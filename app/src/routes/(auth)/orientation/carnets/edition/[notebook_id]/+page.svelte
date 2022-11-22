<script lang="ts">
	import { GetNotebookDocument } from '$lib/graphql/_gen/typed-document-nodes';
	import NotebookEdit from '$lib/ui/OrientationManager/NotebookEdit.svelte';
	import LoaderIndicator from '$lib/ui/utils/LoaderIndicator.svelte';
	import { operationStore, query } from '@urql/svelte';
	import type { PageData } from './$types';

	export let data: PageData;

	const getNotebookResult = operationStore(
		GetNotebookDocument,
		{ id: data.notebookId, withOrientationRequests: true },
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
