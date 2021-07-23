<script context="module" lang="ts">
	import ProBeneficiaryCard from '$lib/ui/ProBeneficiaryCard.svelte';
	import ProBeneficiarySearch from '$lib/ui/ProBeneficiarySearch.svelte';
	import type { GetTeamMembersQuery } from '$lib/_gen/typed-document-nodes';
	import { GetTeamMembersDocument } from '$lib/_gen/typed-document-nodes';
	import type { Load } from '@sveltejs/kit';
	import type { OperationStore } from '@urql/svelte';
	import { operationStore, query } from '@urql/svelte';

	export const load: Load = async () => {
		const result = operationStore(GetTeamMembersDocument);

		return {
			props: {
				result
			}
		};
	};
</script>

<script lang="ts">
	import { goto } from '$app/navigation';

	export let result: OperationStore<GetTeamMembersQuery>;

	query(result);

	function onClick(id: string) {
		goto(`/pro/beneficiaire/${id}`);
	}
</script>

<div class="flex flex-col">
	<div class="pb-6">
		<ProBeneficiarySearch />
	</div>
	<div class="flex flex-row flex-wrap justify-between gap-1">
		{#if $result.fetching}
			<p>Loading...</p>
		{:else if $result.error}
			<p>Oh no... {$result.error.message}</p>
		{:else}
			{#each $result.data.teamMember as teamMember}
				<div class="card-container" on:click={() => onClick(teamMember.beneficiary.id)}>
					<ProBeneficiaryCard beneficiary={teamMember.beneficiary} />
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
