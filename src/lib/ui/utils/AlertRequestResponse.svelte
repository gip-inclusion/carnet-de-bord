<script lang="ts">
	import type { OperationStore } from '@urql/svelte';
	import Alert from '../base/Alert.svelte';

	export let operationStore: OperationStore;
</script>

{#if $operationStore.data}
	<Alert type="success" description="Données modifiées" />
{:else if $operationStore.error}
	<Alert type="error" description="Erreur lors de l'opération" />
{:else}
	<slot />
{/if}
