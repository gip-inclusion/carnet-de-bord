<script lang="ts">
	import type { OperationStore } from '@urql/svelte';

	export let result: OperationStore;
</script>

{#if $result.fetching}
	<div class="flex items-center justify-center">
		<p>Chargement en cours...</p>
	</div>
{:else if $result.error}
	<div class="flex items-center justify-center">
		<p>Une erreur s'est produite. Si le problème persiste, veuillez nous contacter.</p>
	</div>
{:else}
	<slot />
{/if}
