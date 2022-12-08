<script lang="ts">
	import { homeForRole } from '$lib/routes';
	import Breadcrumbs from '$lib/ui/base/Breadcrumbs.svelte';
	import Container from '$lib/ui/BeneficiaryList/Container.svelte';
	import { operationStore, query } from '@urql/svelte';
	import { GetStructureDocument, RoleEnum } from '$lib/graphql/_gen/typed-document-nodes';
	import type { PageData } from './$types';

	export let data: PageData;

	const getStructure = operationStore(GetStructureDocument, { structureId: data.structureId });
	query(getStructure);

	$: structure = $getStructure.data?.structure_by_pk;

	$: breadcrumbs = [
		{
			name: 'accueil',
			path: homeForRole(RoleEnum.AdminStructure),
			label: 'Accueil',
		},
		{
			name: 'structure',
			path: `${homeForRole(RoleEnum.AdminStructure)}/${data.structureId}`,
			label: `${structure?.name ?? ''}`,
		},
		{
			name: 'bénéficiaires',
			path: '',
			label: `Bénéficiaires`,
		},
	];
</script>

<svelte:head>
	<title>Liste des bénéficiaires - Carnet de bord</title>
</svelte:head>
<Breadcrumbs segments={breadcrumbs} />
<h1>Bénéficiaires</h1>
<Container
	listType="structure"
	structureId={data.structureId}
	filter={data.filter}
	search={data.search}
	currentPage={data.currentPage}
	member={data.member}
/>
