<script context="module" lang="ts">
	import LoaderIndicator from '$lib/ui/utils/LoaderIndicator.svelte';
	import type { Load } from '@sveltejs/kit';
	import { GetNotebookDocument } from '$lib/graphql/_gen/typed-document-nodes';
	import { operationStore, query } from '@urql/svelte';
	import NotebookOrientationManagerView from '$lib/ui/OrientationManager/NotebookOrientationManagerView.svelte';

	export const load: Load = ({ params }) => {
		const notebookId = params.notebook_id;

		return {
			props: {
				notebookId,
			},
		};
	};
</script>

<script lang="ts">
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
			],
		}
	);

	query(getNotebookResult);
	$: notebook = $getNotebookResult.data?.notebook[0];
</script>

<svelte:head>
	<title
		>Carnet de {notebook?.beneficiary.lastname}
		{notebook?.beneficiary.firstname} - Carnet de bord</title
	>
</svelte:head>

<LoaderIndicator result={getNotebookResult}>
	<NotebookOrientationManagerView notebook={$getNotebookResult.data?.notebook} />
</LoaderIndicator>
