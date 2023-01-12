<script lang="ts">
	import {
		GetDeploymentByIdDocument,
		GetStructuresForDeploymentDocument,
	} from '$lib/graphql/_gen/typed-document-nodes';
	import { operationStore, query } from '@urql/svelte';
	import LoaderIndicator from '$lib/ui/utils/LoaderIndicator.svelte';

	import { SearchBar } from '$lib/ui/base';
	import StructureList from '$lib/ui/StructureList/StructureList.svelte';
	import Breadcrumbs from '$lib/ui/base/Breadcrumbs.svelte';
	import type { PageData } from './$types';
	import { goto } from '$app/navigation';

	export let data: PageData;

	const getDeploymentStore = operationStore(GetDeploymentByIdDocument, { id: data.deploymentId });
	query(getDeploymentStore);

	const result = operationStore(
		GetStructuresForDeploymentDocument,
		{ deployment: { id: { _eq: data.deploymentId } } },
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

	$: breadcrumbs = [
		{
			name: 'accueil',
			path: '/admin',
			label: 'Accueil',
		},
		{
			name: 'deploiement',
			path: `/admin/deployment/${data.deploymentId}`,
			label: `${$getDeploymentStore?.data?.deployment.label}`,
		},
		{
			name: 'structures',
			path: null,
			label: `Structures`,
		},
	];
</script>

<svelte:head>
	<title>Liste des structures - Carnet de bord</title>
</svelte:head>
<LoaderIndicator result={getDeploymentStore}>
	<LoaderIndicator {result}>
		<Breadcrumbs segments={breadcrumbs} />
		<div class="fr-mt-6w">
			<div class="flex flex-row justify-between items-center">
				<h2 class="fr-h4 pt-4">Liste des structures</h2>
			</div>

			<div class="mb-4 max-w-sm">
				<SearchBar
					inputLabel="Rechercher une structure"
					inputHint="Ex : Nom, ville"
					btnLabel="Rechercher"
					size="md"
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
</LoaderIndicator>
