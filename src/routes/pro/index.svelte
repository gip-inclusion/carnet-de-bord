<script context="module" lang="ts">
	import type { Load } from '@sveltejs/kit';
	import type { IBeneficiary } from 'src/global';

	// see https://kit.svelte.dev/docs#loading
	export const load: Load = async ({ fetch }) => {
		const res = await fetch('api/beneficiaries.json');

		if (res.ok) {
			const beneficiaries = await res.json();

			return {
				props: { beneficiaries }
			};
		}

		const { message } = await res.json();

		return {
			error: new Error(message)
		};
	};
</script>

<script lang="ts">
	import ProBeneficiaryCard from '$lib/components/ProBeneficiaryCard.svelte';

	export let beneficiaries: IBeneficiary[];
</script>

<div class="flex flex-row">
	{#each beneficiaries as beneficiary}
		<ProBeneficiaryCard {beneficiary} />
	{/each}
</div>
