<script lang="ts">
	import type { OperationStore } from '@urql/svelte';

	export let result: OperationStore;
</script>

<div>
	{#if $result.fetching}
		<p>Loading...</p>
	{:else if $result.error}
		<p>Oh no... {$result.error.message}</p>
	{:else}
		<slot />
	{/if}
</div>
