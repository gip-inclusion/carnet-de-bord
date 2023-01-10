<script lang="ts">
	import Breadcrumbs from '$lib/ui/base/Breadcrumbs.svelte';
	import { operationStore, query } from '@urql/svelte';
	import { GetStructureByIdDocument, RoleEnum } from '$lib/graphql/_gen/typed-document-nodes';
	import StructureEditLayer from '$lib/ui/StructureEdit/StructureEditLayer.svelte';
	import LoaderIndicator from '$lib/ui/utils/LoaderIndicator.svelte';
	import type { PageData } from './$types';
	import { homeForRole } from '$lib/routes';

	export let data: PageData;

	const getStructure = operationStore(GetStructureByIdDocument, { structureId: data.structureId });
	query(getStructure);

	$: structure = $getStructure.data?.structure_by_pk;

	$: breadcrumbs = [
		{
			name: 'Liste des structures',
			path: `${homeForRole(RoleEnum.Manager)}/structures`,
			label: 'Liste des Structures',
		},
		{
			name: 'Mettre à jour les informations de structure',
			path: `${homeForRole(RoleEnum.Manager)}/${data.structureId}`,
			label: `${structure?.name ?? ''}`,
		},
	];
</script>

<Breadcrumbs segments={breadcrumbs} />
<LoaderIndicator result={$getStructure}>
	<StructureEditLayer {structure} />
</LoaderIndicator>
