<script context="module" lang="ts">
	import type { GetStructuresQuery } from '$lib/graphql/_gen/typed-document-nodes';
	import { GetStructuresDocument } from '$lib/graphql/_gen/typed-document-nodes';
	import type { Load } from '@sveltejs/kit';
	import type { OperationStore } from '@urql/svelte';
	import { operationStore, query } from '@urql/svelte';
	import LoaderIndicator from '$lib/ui/utils/LoaderIndicator.svelte';

	export const load: Load = async () => {
		const result = operationStore(
			GetStructuresDocument,
			{},
			{ requestPolicy: 'cache-and-network' }
		);

		return {
			props: {
				result,
			},
		};
	};
</script>

<script lang="ts">
	import { SearchBar } from '$lib/ui/base';
	import Dialog from '$lib/ui/Dialog.svelte';
	import AdminDeploymentStructuresImport from '$lib/ui/Manager/ImportStructures.svelte';
	import IconButton from '$lib/ui/base/IconButton.svelte';

	export let result: OperationStore<GetStructuresQuery>;

	query(result);

	$: structures = $result.data?.structure.map(({ __typename, ...rest }) => ({ ...rest }));

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

	function openEditLayer(id: string) {
		console.log(id);
	}
</script>

<svelte:head>
	<title>Liste des structures - Carnet de bord</title>
</svelte:head>
<LoaderIndicator {result}>
	<div class="fr-mt-6w">
		<div class="flex flex-row justify-between items-center">
			<h2 class="fr-h4 pt-4">Liste des structures</h2>
			<div>
				<Dialog
					label="Importer des structures"
					buttonLabel="Importer des structures"
					title="Importer des structures"
					size={'large'}
					showButtons={false}
				>
					<AdminDeploymentStructuresImport />
				</Dialog>
			</div>
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
		<div class={`fr-table  fr-table--layout-fixed`}>
			<table>
				<thead>
					<tr>
						<th class="w-1/2">Nom</th>
						<th class="text-right">Code postal</th>
						<th>Ville</th>
						<th class="text-center">Éditer</th>
					</tr>
				</thead>
				<tbody>
					{#each filteredStructures as structure (structure.id)}
						<tr>
							<td>{structure.name}</td>
							<td class="text-right">{structure.postalCode || ''}</td>
							<td>{structure.city || ''}</td>
							<td class="text-center">
								<IconButton
									icon="fr-icon-edit-line"
									class="fr-btn--tertiary"
									on:click={() => openEditLayer(structure.id)}
									title={`Editer la structure ${structure.name}`}
								/>
							</td>
						</tr>
					{/each}
				</tbody>
			</table>
		</div>
	</div>
</LoaderIndicator>
