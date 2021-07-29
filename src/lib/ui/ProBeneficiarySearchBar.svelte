<script lang="ts">
	import { createEventDispatcher } from 'svelte';

	import Button from '$lib/ui/base/Button.svelte';

	export let filter = null;
	const dispatch = createEventDispatcher();

	async function handleSubmit() {
		dispatch('filter', { filter });
	}
</script>

<div class="font-bold text-3xl pb-10 pt-4">Rechercher un bénéficiaire</div>
<form on:submit|preventDefault={handleSubmit}>
	<div class="bg-gray-300 px-12 py-6 flex">
		<input
			bind:value={filter}
			class="h-16 w-full p-4"
			required
			placeholder="Nom, téléphone, n° CAF, n° Pôle emploi"
		/>
		<Button type="submit" disabled={!filter}>Rechercher</Button>
	</div>
</form>
