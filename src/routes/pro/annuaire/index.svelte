<script context="module" lang="ts">
	import { goto } from '$app/navigation';
	import ProBeneficiaryCard from '$lib/ui/ProBeneficiaryCard.svelte';
	import ProBeneficiarySearch from '$lib/ui/ProBeneficiarySearchBar.svelte';
	import LoaderIndicator from '$lib/ui/utils/LoaderIndicator.svelte';
	import type { SearchBeneficiariesQuery } from '$lib/_gen/typed-document-nodes';
	import { SearchBeneficiariesDocument } from '$lib/_gen/typed-document-nodes';
	import type { Load } from '@sveltejs/kit';
	import type { OperationStore } from '@urql/svelte';
	import { operationStore, query } from '@urql/svelte';

	export const load: Load = async ({ page }) => {
		const filter = page.query.get('filter');
		const result = operationStore(SearchBeneficiariesDocument, {
			filter: `%${filter}%`
		});

		return {
			props: {
				result,
				filter
			}
		};
	};
</script>

<script lang="ts">
	export let result: OperationStore<SearchBeneficiariesQuery>;
	export let filter;

	query(result);

	function onSearch({ detail }) {
		const { filter } = detail;
		$result.variables = { filter: `%${filter}%` };
		$result.reexecute();
	}

	function onClick(id: string) {
		goto(`/pro/beneficiaire/${id}`);
	}
</script>

<div class="flex flex-col">
	<div class="pb-6">
		<ProBeneficiarySearch {filter} on:filter={(event) => onSearch(event)} />
	</div>
	<LoaderIndicator {result}>
		<div class="flex flex-row flex-wrap justify-between gap-1">
			{#each $result.data.beneficiary as beneficiary}
				<div class="card-container" on:click={() => onClick(beneficiary.id)}>
					<ProBeneficiaryCard {beneficiary} />
				</div>
			{/each}
			{#if $result.data.beneficiary.length === 0}
				Aucun résultat
			{/if}
		</div>
	</LoaderIndicator>
</div>

<style lang="postcss">
	.card-container {
		width: 49%;
		@apply py-2;
	}
</style>
