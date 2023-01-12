<script lang="ts">
	import Breadcrumbs from '$lib/ui/base/Breadcrumbs.svelte';
	import { operationStore, query } from '@urql/svelte';
	import { GetStructureByIdDocument, RoleEnum } from '$lib/graphql/_gen/typed-document-nodes';
	import StructureEditLayer from '$lib/ui/StructureEdit/StructureEditLayer.svelte';
	import LoaderIndicator from '$lib/ui/utils/LoaderIndicator.svelte';
	import type { PageData } from './$types';
	import { homeForRole } from '$lib/routes';
	import { goto } from '$app/navigation';

	export let data: PageData;

	const getStructure = operationStore(GetStructureByIdDocument, { structureId: data.structureId });
	query(getStructure);

	$: structure = $getStructure.data?.structure_by_pk;

	const structuresListPath = `${homeForRole(RoleEnum.Manager)}/structures`;

	$: breadcrumbs = [
		{
			name: 'Liste des structures',
			path: structuresListPath,
			label: 'Liste des Structures',
		},
		{
			label: `${structure?.name ?? ''}`,
		},
	];

	function goToStructuresList() {
		goto(structuresListPath);
	}
</script>

<Breadcrumbs segments={breadcrumbs} />
<LoaderIndicator result={$getStructure}>
	<StructureEditLayer {structure} onClose={goToStructuresList} />
</LoaderIndicator>
