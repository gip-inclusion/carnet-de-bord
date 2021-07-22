<script context="module" lang="ts">
	import ProBeneficiaryCard from '$lib/ui/ProBeneficiaryCard.svelte';
	import ProBeneficiarySearch from '$lib/ui/ProBeneficiarySearch.svelte';
	import type { Beneficiary, GetAllBeneficiariesQuery } from '$lib/_gen/typed-document-nodes';
	import { GetAllBeneficiariesDocument } from '$lib/_gen/typed-document-nodes';
	import type { Load } from '@sveltejs/kit';
	import type { OperationStore } from '@urql/svelte';
	import { operationStore, query } from '@urql/svelte';

	export const load: Load = async () => {
		const beneficiaries = operationStore(GetAllBeneficiariesDocument);

		return {
			props: {
				beneficiaries,
				caca: 'popo'
			}
		};
	};
</script>

<script lang="ts">
	export let beneficiaries: OperationStore<
		GetAllBeneficiariesQuery,
		Pick<Beneficiary, 'id' | 'firstname' | 'lastname' | 'email' | 'mobile_number'>
	>;

	query(beneficiaries);
</script>

<div class="flex flex-col">
	<div>
		<ProBeneficiarySearch />
	</div>
	<div class="flex flex-row">
		{#if $beneficiaries.fetching}
			<p>Loading...</p>
		{:else if $beneficiaries.error}
			<p>Oh no... {$beneficiaries.error.message}</p>
		{:else}
			<ul>
				{#each $beneficiaries.data.beneficiary as beneficiary}
					<ProBeneficiaryCard {beneficiary} />
				{/each}
			</ul>
		{/if}
	</div>
</div>
