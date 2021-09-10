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
		<p>Une erreur s'est produite : {$result.error.message}</p>
	</div>
{:else}
	<slot />
{/if}
