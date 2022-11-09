<script lang="ts">
	import { onMount } from 'svelte';

	import type { PageServerData } from './$types';
	export let data: PageServerData;

	onMount(() => {
		window.location.replace(data.redirectAfterLogin ?? '/');
	});
</script>

<div class="pt-28 flex flex-col grow items-center">
	<p class="pb-12 text-xl">Chargement en cours…</p>
</div>
