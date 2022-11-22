<script lang="ts">
	import { GetNotebookByIdDocument } from '$lib/graphql/_gen/typed-document-nodes';
	import { displayFullName } from '$lib/ui/format';
	import LoaderIndicator from '$lib/ui/utils/LoaderIndicator.svelte';
	import NotebookView from '$lib/ui/views/NotebookView.svelte';
	import { operationStore, query } from '@urql/svelte';
	import type { PageData } from './$types';

	export let data: PageData;

	const getNotebookResult = operationStore(GetNotebookByIdDocument, {
		id: data.notebookId,
		withOrientationRequests: true,
	});
	query(getNotebookResult);

	$: name = $getNotebookResult.data?.notebook
		? displayFullName($getNotebookResult.data?.notebook.beneficiary)
		: '';
</script>

<svelte:head>
	<title>Carnet {name} - Carnet de bord</title>
</svelte:head>

<LoaderIndicator result={getNotebookResult}>
	<NotebookView notebook={$getNotebookResult.data.notebook} />
</LoaderIndicator>
