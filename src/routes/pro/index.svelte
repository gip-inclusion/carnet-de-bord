<script context="module" lang="ts">
	import { operationStore } from '@urql/svelte';

	export const load: Load = async ({ context }) => {
		const beneficiaries = operationStore(`
        query {
              beneficiary {
                address1
                address2
                caf_number
                city
                email
                firstname
                id
                lastname
                mobile_number
                pe_number
                postal_code
              }
            }
  `);

		return {
			props: {
				beneficiaries
			}
		};
	};
</script>

<script lang="ts">
	import ProBeneficiaryCard from '$lib/components/ProBeneficiaryCard.svelte';
	import type { Load } from '@sveltejs/kit';
	import { query } from '@urql/svelte';

	export let beneficiaries;
	query(beneficiaries);
</script>

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
