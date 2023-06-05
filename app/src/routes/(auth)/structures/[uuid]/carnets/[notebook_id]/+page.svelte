<script lang="ts">
	import { GetNotebookByIdDocument } from '$lib/graphql/_gen/typed-document-nodes';
	import type { PageData } from './$types';
	import { operationStore, query } from '@urql/svelte';
	import LoaderIndicator from '$lib/ui/utils/LoaderIndicator.svelte';
	import NotebookView from '$lib/ui/views/NotebookView.svelte';

	export let data: PageData;

	const getNotebookResult = operationStore(
		GetNotebookByIdDocument,
		{
			id: data.notebookId,
		},
		{ additionalTypenames: ['notebook_appointment'] }
	);
	query(getNotebookResult);
</script>

<svelte:head>
	<title>Carnet notebookId={data.notebookId} - Carnet de bord</title>
</svelte:head>

<LoaderIndicator result={getNotebookResult}>
	<NotebookView notebook={$getNotebookResult.data.notebook} />
</LoaderIndicator>
