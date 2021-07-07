<script context="module" lang="ts">
	import type { Load } from '@sveltejs/kit';

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
	import type Beneficiaire from '$database/Beneficiaire';

	export let beneficiaires: Beneficiaire[];
</script>

<svelte:head>
	<title>Bénéficiaires</title>
</svelte:head>
<div class="flex flex-row">
	{#each beneficiaires as beneficiaire}
		<div class="p-5 border-2 m-2">
			<div class="flex flex-row">
				<div>{beneficiaire.nom}</div>
				<div class="pl-2">{beneficiaire.prenom}</div>
			</div>
		</div>
	{/each}
</div>
