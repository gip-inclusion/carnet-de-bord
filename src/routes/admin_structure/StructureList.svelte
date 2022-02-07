<script lang="ts">
	import type { StructureCard } from './index.svelte';

	export let structures: StructureCard[];
</script>

<div>
	{#each structures as structure}
		{structure.name}
	{/each}
</div>
