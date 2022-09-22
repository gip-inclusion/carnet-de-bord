<script context="module" lang="ts">
	import type { Load } from '@sveltejs/kit';

	export const load: Load = ({ params }) => {
		const deploymentId = params.uuid;
		return {
			props: {
				deploymentId,
			},
		};
	};
</script>

<script lang="ts">
	import {
		GetDeploymentByIdDocument,
		GetStructuresForDeploymentDocument,
		GetStructuresForDeploymentQuery,
	} from '$lib/graphql/_gen/typed-document-nodes';
	import { operationStore, query } from '@urql/svelte';
	import LoaderIndicator from '$lib/ui/utils/LoaderIndicator.svelte';

	import { SearchBar } from '$lib/ui/base';
	import Button from '$lib/ui/base/Button.svelte';
	import StructureList from '$lib/ui/StructureList/StructureList.svelte';
	import { openComponent } from '$lib/stores';
	import StructureEditLayer from '$lib/ui/StructureEdit/StructureEditLayer.svelte';
	import Breadcrumbs from '$lib/ui/base/Breadcrumbs.svelte';

	export let deploymentId: string;
	type Structure = GetStructuresForDeploymentQuery['structure'][0];

	const getDeploymentStore = operationStore(GetDeploymentByIdDocument, { id: deploymentId });
	query(getDeploymentStore);

	const result = operationStore(
		GetStructuresForDeploymentDocument,
		{ deployment: { id: { _eq: deploymentId } } },
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

	function openEditLayer(structure: Structure) {
		openComponent.open({
			component: StructureEditLayer,
			props: {
				structure: structure,
			},
		});
	}
	$: breadcrumbs = [
		{
			name: 'accueil',
			path: '/admin',
			label: 'Accueil',
		},
		{
			name: 'deploiement',
			path: `/admin/deployment/${deploymentId}`,
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
				<div>
					<Button>Ajouter une structure</Button>
				</div>
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
				on:edit={(event) => openEditLayer(event.detail.structure)}
			/>
		</div>
	</LoaderIndicator>
</LoaderIndicator>
