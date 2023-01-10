<script lang="ts">
	import { SearchBar } from '$lib/ui/base';
	import Dialog from '$lib/ui/Dialog.svelte';
	import AdminDeploymentStructuresImport from '$lib/ui/Manager/ImportStructures.svelte';
	import StructureList from '$lib/ui/StructureList/StructureList.svelte';
	import { GetStructuresForDeploymentDocument } from '$lib/graphql/_gen/typed-document-nodes';
	import { operationStore, query } from '@urql/svelte';
	import LoaderIndicator from '$lib/ui/utils/LoaderIndicator.svelte';
	import { goto } from '$app/navigation';

	const result = operationStore(
		GetStructuresForDeploymentDocument,
		{},
		{ requestPolicy: 'cache-and-network' }
	);

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
		<StructureList
			structures={filteredStructures}
			on:edit={(event) => goto(`structures/${event.detail.structure.id}`)}
		/>
	</div>
</LoaderIndicator>
