<script context="module" lang="ts">
	import type { Load } from '@sveltejs/kit';
	import type { IBeneficiaire } from 'src/global';

	// see https://kit.svelte.dev/docs#loading
	export const load: Load = async ({ fetch }) => {
		const res = await fetch('/beneficiaires.json');

		if (res.ok) {
			const beneficiaires = await res.json();

			return {
				props: { beneficiaires }
			};
		}

		const { message } = await res.json();

		return {
			error: new Error(message)
		};
	};
</script>

<script lang="ts">
	import ProBeneficiaireCard from '$lib/components/ProBeneficiaireCard.svelte';

	export let beneficiaires: IBeneficiaire[];
</script>

<svelte:head>
	<title>Bénéficiaires</title>
</svelte:head>
<div class="flex flex-row">
	{#each beneficiaires as beneficiaire}
		<ProBeneficiaireCard {beneficiaire} />
	{/each}
</div>
