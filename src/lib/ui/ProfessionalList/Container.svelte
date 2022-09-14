<script lang="ts">
	// import type { GetProfessionalsFromStructuresQuery } from '$lib/graphql/_gen/typed-document-nodes';
	import { GetProfessionalsForStructureDocument } from '$lib/graphql/_gen/typed-document-nodes';

	import { operationStore, query } from '@urql/svelte';
	import { LoaderIndicator } from '../utils';
	import List from './List.svelte';

	export let structureId: string = null;

	const getProfessionals = operationStore(
		GetProfessionalsForStructureDocument,
		{ structureId },
		{ requestPolicy: 'cache-and-network' }
	);

	query(getProfessionals);

	$: professionals = $getProfessionals.data?.professional ?? [];
</script>

<div class="flex flex-col gap-8">
	<LoaderIndicator result={getProfessionals}>
		<List {professionals} />
	</LoaderIndicator>
</div>
