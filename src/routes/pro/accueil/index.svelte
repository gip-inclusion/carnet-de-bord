<script context="module" lang="ts">
	import ProBeneficiaryCard from '$lib/ui/ProBeneficiaryCard.svelte';
	import ProBeneficiarySearch from '$lib/ui/ProBeneficiarySearchBar.svelte';
	import type { GetBeneficiariesQuery } from '$lib/_gen/typed-document-nodes';
	import { SearchBeneficiariesDocument } from '$lib/_gen/typed-document-nodes';
	import type { Load } from '@sveltejs/kit';
	import type { OperationStore } from '@urql/svelte';
	import { operationStore, query } from '@urql/svelte';

	export const load: Load = async () => {
		const result = operationStore(SearchBeneficiariesDocument);

		return {
			props: {
				result
			}
		};
	};
</script>

<script lang="ts">
	import { goto } from '$app/navigation';

	export let result: OperationStore<GetBeneficiariesQuery>;

	query(result);

	function onSearch({ detail }) {
		const { filter } = detail;
		goto(`/pro/annuaire?filter=${filter}`);
	}

	function onSelect(id: string) {
		goto(`/pro/beneficiaire/${id}`);
	}
</script>

<div class="flex flex-col">
	<div class="pb-6">
		<ProBeneficiarySearch on:filter={(event) => onSearch(event)} />
	</div>
	<div class="flex flex-row flex-wrap justify-between gap-1">
		{#if $result.fetching}
			<p>Loading...</p>
		{:else if $result.error}
			<p>Oh no... {$result.error.message}</p>
		{:else}
			{#each $result.data.beneficiary as beneficiary}
				<div class="card-container" on:click={() => onSelect(beneficiary.id)}>
					<ProBeneficiaryCard {beneficiary} />
				</div>
			{/each}
		{/if}
	</div>
</div>

<style lang="postcss">
	.card-container {
		width: 49%;
		@apply py-2;
	}
</style>
