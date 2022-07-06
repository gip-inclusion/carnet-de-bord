<script lang="ts" context="module">
	import type { Load } from '@sveltejs/kit';

	export const load: Load = async ({ params, url }) => {
		const searchParams = url.searchParams;
		const structureId = params.uuid;
		return {
			props: {
				structureId,
				currentPage: parseInt(searchParams.get('page') ?? '1', 10),
				filter: getFilter(searchParams.get('filter')),
				search: searchParams.get('search') ?? '',
			},
		};
	};
</script>

<script lang="ts">
	import type { MemberFilter } from '$lib/ui/BeneficiaryList/Filters.svelte';
	import { homeForRole } from '$lib/routes';
	import Breadcrumbs from '$lib/ui/base/Breadcrumbs.svelte';
	import { getFilter } from '$lib/ui/BeneficiaryList/Filters.svelte';
	import {
		createSelectionStore,
		selectionContextKey,
	} from '$lib/ui/BeneficiaryList/MultipageSelectionStore';
	import Container from '$lib/ui/BeneficiaryList/Container.svelte';
	import { setContext } from 'svelte';
	import { operationStore, query } from '@urql/svelte';
	import { GetStructureDocument } from '$lib/graphql/_gen/typed-document-nodes';

	export let search: string;
	export let filter: MemberFilter;
	export let currentPage: number;
	export let structureId: string;

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
			name: 'bénéficiaires',
			path: '',
			label: `Bénéficiaires`,
		},
	];
	setContext(selectionContextKey, createSelectionStore());
</script>

<svelte:head>
	<title>Liste des bénéficiaires - Carnet de bord</title>
</svelte:head>
<Breadcrumbs segments={breadcrumbs} />
<h1>Bénéficiaires</h1>
<Container listType="structure" {structureId} {filter} {search} {currentPage} />
