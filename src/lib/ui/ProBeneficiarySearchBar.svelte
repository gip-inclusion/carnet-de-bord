<script lang="ts">
	import { createEventDispatcher } from 'svelte';

	import Button from './Button.svelte';

	let search;
	const dispatch = createEventDispatcher();

	async function handleSubmit() {
		dispatch('search', { search });
	}
</script>

<div class="font-bold text-3xl pb-10 pt-4">Rechercher un bénéficiaire</div>
<form on:submit|preventDefault={handleSubmit}>
	<div class="bg-gray-300 px-12 py-6 flex">
		<input
			bind:value={search}
			class="h-16 w-full p-4"
			required
			placeholder="Nom, téléphone, n° CAF, n° Pôle emploi"
		/>
		<Button type="submit" disabled={!search}>Rechercher</Button>
	</div>
</form>
