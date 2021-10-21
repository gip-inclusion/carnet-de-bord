<script context="module" lang="ts">
	import type { Professional } from '$lib/graphql/_gen/typed-document-nodes';
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
	const getAccountStore = operationStore(GetAccountByPkDocument, variables);
	query(getAccountStore);
	$: acc = $getAccountStore?.data?.account_by_pk;
	$: professional = acc?.professional as Professional | null;
</script>

<svelte:head>
	<title>Fiche professionnel - carnet de bord</title>
</svelte:head>

<div class="flex flex-col gap-8 p-20">
	<LoaderIndicator result={getAccountStore}>
		{#if acc.professional}
			<ProWithStructureView {professional} proFirst={true} />
		{/if}
	</LoaderIndicator>
</div>
