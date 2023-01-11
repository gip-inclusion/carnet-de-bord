<script lang="ts">
	import Breadcrumbs from '$lib/ui/base/Breadcrumbs.svelte';
	import { operationStore, query } from '@urql/svelte';
	import { GetStructureByIdDocument } from '$lib/graphql/_gen/typed-document-nodes';
	import StructureEditLayer from '$lib/ui/StructureEdit/StructureEditLayer.svelte';
	import LoaderIndicator from '$lib/ui/utils/LoaderIndicator.svelte';
	import type { PageData } from './$types';
	import { goto } from '$app/navigation';

	export let data: PageData;

	const getStructure = operationStore(GetStructureByIdDocument, { structureId: data.structureId });
	query(getStructure);

	$: structure = $getStructure.data?.structure_by_pk;

	$: structuresListPath = `/admin/deployment/${structure?.deployment.id}/structures`;

	$: breadcrumbs = [
		{
			name: 'accueil',
			path: '/admin',
			label: 'Accueil',
		},
		{
			name: 'deploiement',
			path: `/admin/deployment/${structure?.deployment.id}`,
			label: `${structure?.deployment.label ?? ''}`,
		},
		{
			name: 'structures',
			path: structuresListPath,
			label: 'Structures',
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
