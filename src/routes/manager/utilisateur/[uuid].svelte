<script context="module" lang="ts">
	import { GetAccountByPkDocument } from '$lib/graphql/_gen/typed-document-nodes';
	import { LoaderIndicator } from '$lib/ui/utils';
	import type { Load } from '@sveltejs/kit';
	import { operationStore, query } from '@urql/svelte';

	export const load: Load = ({ page }) => {
		const accountId = page.params.uuid;

		return {
			props: {
				accountId,
			},
		};
	};
</script>

<script lang="ts">
	import ProWithStructureView from '$lib/ui/ProNotebookMember/ProWithStructureView.svelte';

	export let accountId: string;
	const variables = { accountId };
	const getAccountByPkStore = operationStore(GetAccountByPkDocument, variables);
	query(getAccountByPkStore);
	$: acc = $getAccountByPkStore?.data?.account_by_pk;
	$: professional = acc?.professional;
</script>

<svelte:head>
	<title>Fiche professionnel - carnet de bord</title>
</svelte:head>

<LoaderIndicator result={getAccountByPkStore}>
	{#if acc.professional}
		<ProWithStructureView {professional} proFirst={true} />
	{/if}
</LoaderIndicator>
