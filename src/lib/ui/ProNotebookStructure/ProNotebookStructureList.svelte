<script lang="ts">
	import type { Structure } from '$lib/graphql/_gen/typed-document-nodes';

	export let structures: Pick<
		Structure,
		'id' | 'name' | 'phone' | 'postalCode' | 'city' | 'address1' | 'address2'
	>[];
</script>

<div>
	<div class="py-2">
		<h1>Structures sollicitées</h1>
	</div>
	{#each structures as structure, i (i)}
		<div class="border-b-2 border-gray-300 py-2">
			<div class="font-bold text-xl">{structure.name || ''}</div>
			<div>{structure.phone || ''}</div>
			<div>{structure.address1 || ''}</div>
			<div>{structure.address2 || ''}</div>
			<div class="flex flex-row gap-2">
				<div>{structure.postalCode || ''}</div>
				<div>{structure.city || ''}</div>
			</div>
		</div>
	{/each}
</div>
