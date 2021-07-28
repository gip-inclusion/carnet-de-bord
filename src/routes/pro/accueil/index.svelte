<script context="module" lang="ts">
	import { goto } from '$app/navigation';
	import ProBeneficiaryCard from '$lib/ui/ProBeneficiaryCard.svelte';
	import ProBeneficiarySearch from '$lib/ui/ProBeneficiarySearchBar.svelte';
	import type { GetLastVisitedOrUpdatedQuery } from '$lib/_gen/typed-document-nodes';
	import { GetLastVisitedOrUpdatedDocument } from '$lib/_gen/typed-document-nodes';
	import type { Load } from '@sveltejs/kit';
	import type { OperationStore } from '@urql/svelte';
	import { operationStore, query } from '@urql/svelte';

	export const load: Load = async ({ session }) => {
		const { professionalId } = session.user;
		const result = operationStore(GetLastVisitedOrUpdatedDocument, { professionalId });

		return {
			props: {
				result
			}
		};
	};
</script>

<script lang="ts">
	export let result: OperationStore<GetLastVisitedOrUpdatedQuery>;

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

	<div>
		<div>Les derniers profils visités</div>
		<div class="flex flex-row flex-wrap justify-between gap-1">
			{#if $result.fetching}
				<p>Loading...</p>
			{:else if $result.error}
				<p>Oh no... {$result.error.message}</p>
			{:else}
				{#each $result.data.lastVisited as lastVisited}
					<div
						class="card-container"
						on:click={() => onSelect(lastVisited.notebook.beneficiary.id)}
					>
						<ProBeneficiaryCard beneficiary={lastVisited.notebook.beneficiary} />
					</div>
				{/each}
			{/if}
		</div>
	</div>

	<div>
		<div>Les derniers profils modifiés par un autre accompagnateur</div>
		<div class="flex flex-row flex-wrap justify-between gap-1">
			{#if $result.fetching}
				<p>Loading...</p>
			{:else if $result.error}
				<p>Oh no... {$result.error.message}</p>
			{:else}
				{#each $result.data.lastUpdated as lastUpdated}
					<div
						class="card-container"
						on:click={() => onSelect(lastUpdated.notebook.beneficiary.id)}
					>
						<ProBeneficiaryCard beneficiary={lastUpdated.notebook.beneficiary} />
					</div>
				{/each}
			{/if}
		</div>
	</div>
</div>

<style lang="postcss">
	.card-container {
		width: 49%;
		@apply py-2;
	}
</style>
