<script lang="ts">
	import { GetNotebookDocument } from '$lib/graphql/_gen/typed-document-nodes';
	import NotebookEdit from '$lib/ui/OrientationManager/NotebookEdit.svelte';
	import LoaderIndicator from '$lib/ui/utils/LoaderIndicator.svelte';
	import { operationStore, query } from '@urql/svelte';
	import type { PageData } from './$types';
	import NotebookEventList from '$lib/ui/NotebookEvent/NotebookEventList.svelte';

	export let data: PageData;

	const getNotebookResult = operationStore(
		GetNotebookDocument,
		{ id: data.notebookId, withOrientationRequests: true },
		{
			additionalTypenames: [
				'beneficiary',
				'notebook_member',
				'professional_project',
				'notebook_appointment',
				'notebook_focus',
				'notebook_info',
				'notebook_action',
				'orientation_request',
			],
		}
	);

	query(getNotebookResult);
	$: notebookPublic = $getNotebookResult.data?.notebook_public_view[0];

	function refreshNotebook() {
		getNotebookResult.reexecute({ requestPolicy: 'network-only' });
	}
</script>

<LoaderIndicator result={getNotebookResult}>
	<NotebookEdit notebook={notebookPublic} on:beneficiary-orientation-changed={refreshNotebook} />

	<NotebookEventList notebook={notebookPublic['notebook']} />
</LoaderIndicator>
