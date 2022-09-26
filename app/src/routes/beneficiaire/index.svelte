<script context="module" lang="ts">
	import NotebookView from '$lib/ui/views/NotebookView.svelte';
	import LoaderIndicator from '$lib/ui/utils/LoaderIndicator.svelte';
	import type { Load } from '@sveltejs/kit';
	import { GetNotebookByBeneficiaryIdDocument } from '$lib/graphql/_gen/typed-document-nodes';
	import { operationStore, query } from '@urql/svelte';

	export const load: Load = ({ session }) => {
		const beneficiaryId = session.user.beneficiaryId;

		return {
			props: {
				beneficiaryId,
			},
		};
	};
</script>

<script lang="ts">
	export let beneficiaryId: string;

	const getNotebookResult = operationStore(GetNotebookByBeneficiaryIdDocument, {
		id: beneficiaryId,
	});
	query(getNotebookResult);
</script>

<svelte:head>
	<title>Accueil Bénéficiaire - Carnet de bord</title>
</svelte:head>

<LoaderIndicator result={getNotebookResult}>
	<NotebookView notebook={getNotebookResult.data.notebook[0]} />
</LoaderIndicator>
