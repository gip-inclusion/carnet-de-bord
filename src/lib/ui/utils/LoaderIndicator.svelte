<script lang="ts">
	import type { OperationStore } from '@urql/svelte';

	export let result: OperationStore;
</script>

{#if $result.fetching}
	<p>Chargement en cours...</p>
{:else if $result.error}
	<p>Une erreur s'est produite : {$result.error.message}</p>
{:else}
	<slot />
{/if}
