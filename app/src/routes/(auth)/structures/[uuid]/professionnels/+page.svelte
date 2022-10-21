<script lang="ts">
	import { homeForRole } from '$lib/routes';
	import Breadcrumbs from '$lib/ui/base/Breadcrumbs.svelte';
	import { operationStore, query } from '@urql/svelte';
	import { GetStructureDocument, RoleEnum } from '$lib/graphql/_gen/typed-document-nodes';
	import Container from '$lib/ui/ProfessionalList/Container.svelte';
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
			name: 'professionels',
			path: '',
			label: 'Professionnels',
		},
	];
</script>

<svelte:head>
	<title>Liste des professionnels - Carnet de bord</title>
</svelte:head>
<Breadcrumbs segments={breadcrumbs} />
<h1>Professionnels</h1>
<Container structureId={data.structureId} filter={data.filter} />
