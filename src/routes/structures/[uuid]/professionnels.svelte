<script lang="ts" context="module">
	import type { Load } from '@sveltejs/kit';

	export const load: Load = async ({ params, url }) => {
		const searchParams = url.searchParams;
		const structureId = params.uuid;
		return {
			props: {
				structureId,
				filter: getFilter(searchParams.get('filter')),
			},
		};
	};
</script>

<script lang="ts">
	import type { BeneficiaryCountFilter } from '$lib/ui/ProfessionalList/Filters.svelte';
	import { homeForRole } from '$lib/routes';
	import Breadcrumbs from '$lib/ui/base/Breadcrumbs.svelte';
	import { getFilter } from '$lib/ui/ProfessionalList/Filters.svelte';
	import { operationStore, query } from '@urql/svelte';
	import { GetStructureDocument } from '$lib/graphql/_gen/typed-document-nodes';
	import Container from '$lib/ui/ProfessionalList/Container.svelte';

	export let structureId: string = null;
	export let filter: BeneficiaryCountFilter;

	const getStructure = operationStore(GetStructureDocument, { structureId });
	query(getStructure);

	$: structure = $getStructure.data?.structure_by_pk;

	$: breadcrumbs = [
		{
			name: 'accueil',
			path: homeForRole('admin_structure'),
			label: 'Accueil',
		},
		{
			name: 'structure',
			path: `${homeForRole('admin_structure')}/${structureId}`,
			label: `${structure?.name ?? ''}`,
		},
		{
			name: 'professionels',
			path: '',
			label: 'Professionnels',
		},
	];
</script>

<svelte:head>
	<title>Liste des professionels - Carnet de bord</title>
</svelte:head>
<Breadcrumbs segments={breadcrumbs} />
<h1>Professionels</h1>
<Container {structureId} {filter} />
