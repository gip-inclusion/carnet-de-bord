<script context="module" lang="ts">
	import type { GetStructuresQuery } from '$lib/graphql/_gen/typed-document-nodes';
	import { GetStructuresDocument } from '$lib/graphql/_gen/typed-document-nodes';
	import type { Load } from '@sveltejs/kit';
	import type { OperationStore } from '@urql/svelte';
	import { operationStore, query } from '@urql/svelte';
	import LoaderIndicator from '$lib/ui/utils/LoaderIndicator.svelte';

	export const load: Load = async () => {
		const result = operationStore(GetStructuresDocument, {});

		return {
			props: {
				result
			}
		};
	};
</script>

<script lang="ts">
	import Text from '$lib/ui/utils/Text.svelte';

	export let result: OperationStore<GetStructuresQuery>;

	query(result);

	$: structures = $result.data?.structure;
</script>

<div class="flex flex-col gap-8 px-40">
	<LoaderIndicator {result}>
		<div>
			<h2 class="fr-h4 pt-4">Liste des structures</h2>
			<div class="flex flex-column flex-wrap justify-between gap-2">
				{#each structures as structure (structure.id)}
					<div class="flex gap-2 p-3 border-2 border-information w-full">
						<div class="flex-column">
							<div class="text-information">Nom</div>
							<Text value={structure.name} />
						</div>

						<div class="flex-column">
							<div class="text-information">Contact</div>
							<Text value={structure.email} />
							<Text value={structure.phone} />
						</div>

						<div class="flex-column">
							<div class="text-information">Ville</div>
							<div class="flex flex-row">
								<Text value={structure.address1} />
								<Text value={structure.address2} />
							</div>
							<div class="flex flex-row">
								<Text value={structure.postalCode} />
								<Text value={structure.city} />
							</div>
						</div>
					</div>
				{/each}
			</div>
		</div>
	</LoaderIndicator>
</div>
