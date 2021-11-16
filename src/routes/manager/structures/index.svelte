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
				result,
			},
		};
	};
</script>

<script lang="ts">
	import { IconButton, SearchBar } from '$lib/ui/base';
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
				onCancel: openComponent.close,
			},
		});
	}

	let search = '';
	function handleSubmit() {
		const matcher = match(search);
		filteredStructures = structures?.filter(
			({ name, city, postalCode, email, phone, siret }) =>
				!search ||
				matcher(name) ||
				matcher(city) ||
				matcher(postalCode) ||
				matcher(email) ||
				matcher(phone) ||
				matcher(siret)
		);
	}

	const match = (needle: string) => {
		const needleLower = needle.toLowerCase();
		return (haystack: string) => haystack && haystack.toLowerCase().includes(needleLower);
	};

	$: filteredStructures = structures;
</script>

<LoaderIndicator {result}>
	<div>
		<div class="flex flex-row justify-between">
			<h2 class="fr-h4 pt-4">Liste des structures</h2>
			<IconButton
				on:click={() => openStructureLayer(null)}
				icon="ri-add-circle-line"
				ariaLabel="Ajouter un structure"
			/>
		</div>

		<div class="mb-4">
			<SearchBar
				inputLabel="Rechercher une structure"
				inputHint="Ex : Nom, ville"
				btnLabel="Rechercher"
				bind:search
				{handleSubmit}
			/>
		</div>
		<div class={`w-full fr-table fr-table--layout-fixed`}>
			<table>
				<thead>
					<tr>
						<th>Nom</th>
						<th>Code postal</th>
						<th>Ville</th>
					</tr>
				</thead>
				<tbody>
					{#each filteredStructures as structure (structure.id)}
						<tr class="cursor-pointer" on:click={() => openStructureLayer(structure)}>
							<td>{structure.name}</td>
							<td>{structure.postalCode || ''}</td>
							<td>{structure.city || ''}</td>
						</tr>
					{/each}
				</tbody>
			</table>
		</div>
	</div>
</LoaderIndicator>
