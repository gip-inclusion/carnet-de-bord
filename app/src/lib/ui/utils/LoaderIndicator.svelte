<script lang="ts">
	import type { OperationStore } from '@urql/svelte';
	import { Spinner } from '$lib/ui/base';

	export let result: OperationStore;
</script>

{#if $result.fetching}
	<div class="flex items-center justify-center my-10">
		<Spinner />
	</div>
{:else if $result.error}
	<div class="flex items-center justify-center">
		<p>Une erreur s'est produite. Si le problème persiste, veuillez nous contacter.</p>
	</div>
{:else}
	<slot />
{/if}
