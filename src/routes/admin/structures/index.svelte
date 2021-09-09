<script context="module" lang="ts">
	import type { GetStructuresQuery } from '$lib/graphql/_gen/typed-document-nodes';
	import { GetStructuresDocument } from '$lib/graphql/_gen/typed-document-nodes';
	import type { Load } from '@sveltejs/kit';
	import type { OperationStore } from '@urql/svelte';
	import { operationStore, query } from '@urql/svelte';
	import LoaderIndicator from '$lib/ui/utils/LoaderIndicator.svelte';
	import { openComponent } from '$lib/stores';
	import StructureFormInfo from '$lib/ui/StructureFormInfo.svelte';

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
	import { Button } from '$lib/ui/base';
	import Text from '$lib/ui/utils/Text.svelte';
	import type { Structure } from '$lib/types';

	export let result: OperationStore<GetStructuresQuery>;

	query(result);

	$: structures = $result.data?.structure.map(({ __typename, ...rest }) => ({ ...rest }));

	function openStructureLayer(structure: Structure | null) {
		openComponent.open({
			component: StructureFormInfo,
			props: {
				structure: structure || {},
				structureId: structure ? structure.id : null,
				globalError: '',
				fieldErrors: {},
				confirmText: 'Enregistrer',
				onInput: () => {
					/* ignore */
				},
				disabledKeys: {},
				onCancel: openComponent.close
			}
		});
	}
</script>

<div class="flex flex-col gap-8 px-40">
	<LoaderIndicator {result}>
		<div>
			<h2 class="fr-h4 pt-4">Liste des structures</h2>
			<div class="flex flex-column flex-wrap justify-between gap-2">
				<div class="w-full">
					<Button classNames="float-right" on:click={() => openStructureLayer(null)} outline={true}
						>Ajouter une structure</Button
					>
				</div>
				{#each structures as structure (structure.id)}
					<div class="flex gap-2 p-3 border-2 border-information w-full">
						<div class="flex-column">
							<div class="text-information">Nom</div>
							<Text defaultValue={'-'} value={structure.name} />
						</div>

						<div class="flex-column">
							<div class="text-information">Contact</div>
							<Text defaultValue={'-'} value={structure.email} />
							<Text defaultValue={'-'} value={structure.phone} />
						</div>

						<div class="flex-column">
							<div class="text-information">Ville</div>
							<div class="flex flex-row">
								<Text defaultValue={'-'} value={structure.address1} />
								<Text defaultValue={''} value={structure.address2} />
							</div>
							<div class="flex flex-row">
								{#if !structure.postalCode && !structure.city}
									-
								{:else}
									<Text defaultValue={''} value={structure.postalCode} />
									{#if structure.postalCode && structure.city}{' '}{/if}
									<Text defaultValue={''} value={structure.city} />
								{/if}
							</div>
						</div>
						<div class="flex-grow" />
						<div class="self-center">
							<Button
								on:click={() => openStructureLayer(structure)}
								outline={true}
								icon="ri-edit-line"
							/>
						</div>
					</div>
				{/each}
			</div>
		</div>
	</LoaderIndicator>
</div>
