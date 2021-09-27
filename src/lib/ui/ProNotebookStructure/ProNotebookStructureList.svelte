<script lang="ts">
	import type { Structure } from '$lib/graphql/_gen/typed-document-nodes';
	import { openComponent } from '$lib/stores';
	import Button from '../base/Button.svelte';
	import Text from '../utils/Text.svelte';

	export let structures: Pick<
		Structure,
		'id' | 'name' | 'phone' | 'postalCode' | 'city' | 'address1' | 'address2' | 'website'
	>[];
</script>

<div class="flex flex-col gap-6">
	<h1>Structures sollicitées</h1>
	<div class="flex flex-col gap-4">
		{#each structures as structure, i (i)}
			<div class="flex flex-col border-b-1 pb-6">
				<span class="mb-1 text-sm">Structure</span>
				<h2 class="fr-h5 !mb-0 text-france-blue truncate" title={structure?.name}>
					{structure?.name}
				</h2>
				<div class="flex flex-col gap-1">
					{#each [structure?.address1, structure?.address2].filter(Boolean) as line}
						<Text value={line} />
					{/each}
					<Text value={[structure?.postalCode, structure?.city].filter(Boolean).join(' ')} />
					<Text
						defaultValueClassNames="italic"
						defaultValue="Pas de site web"
						value={structure?.website}
					/>
				</div>
			</div>
		{/each}
	</div>

	<div class="mt-6">
		<Button
			on:click={() => {
				openComponent.close();
			}}>Fermer</Button
		>
	</div>
</div>

<style>
	.border-b-1 {
		border-bottom-width: 1px;
	}
</style>
