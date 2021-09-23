<script lang="ts">
	import { createEventDispatcher } from 'svelte';

	import { SearchBar } from '$lib/ui/base';

	export let search = '';
	const dispatch = createEventDispatcher();

	async function handleSubmit() {
		dispatch('search', { search });
	}

	export let size: string | null = 'lg';
</script>

<SearchBar
	inputLabel="Rechercher un bénéficiaire"
	inputHint="Nom, téléphone, n° CAF, n° Pôle emploi"
	btnLabel="Rechercher"
	bind:search
	{handleSubmit}
	{size}
/>
