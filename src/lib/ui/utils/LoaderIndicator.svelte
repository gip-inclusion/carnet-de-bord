<script lang="ts">
	import type { OperationStore } from '@urql/svelte';
	import { LayerCDB } from '..';

	export let result: OperationStore;
</script>

{#if $result.fetching}
	<div class="flex items-center justify-center">
		<p>Chargement en cours...</p>
		<LayerCDB />
	</div>
{:else if $result.error}
	<div class="flex items-center justify-center">
		<p>Une erreur s'est produite. Si le problème persiste, veuillez nous contacter.</p>
		<LayerCDB />
	</div>
{:else}
	<slot />
{/if}
