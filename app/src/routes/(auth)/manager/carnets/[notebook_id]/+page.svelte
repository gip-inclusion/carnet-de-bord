<script lang="ts">
	import NotebookView from '$lib/ui/views/NotebookView.svelte';
	import LoaderIndicator from '$lib/ui/utils/LoaderIndicator.svelte';
	import { GetNotebookByIdDocument } from '$lib/graphql/_gen/typed-document-nodes';
	import { operationStore, query } from '@urql/svelte';
	import type { PageData } from './$types';

	export let data: PageData;

	const getNotebookResult = operationStore(GetNotebookByIdDocument, {
		id: data.notebookId,
	});
	query(getNotebookResult);
</script>

<svelte:head>
	<title>Carnet notebookId={data.notebookId} - Carnet de bord</title>
</svelte:head>

<LoaderIndicator result={getNotebookResult}>
	<NotebookView notebook={$getNotebookResult.data.notebook} />
</LoaderIndicator>
