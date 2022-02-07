<script lang="ts" context="module">
	import { GetManagedStructuresDocument } from '$lib/graphql/_gen/typed-document-nodes';
	import type { Load } from '@sveltejs/kit';
	import { operationStore, query } from '@urql/svelte';
	export type StructureCard = {
		name: string;
		city: string;
		nbAdmin: number;
		nbProfessional: number;
		nbBeneficiary: number;
	};
	export const load: Load = async () => {
		const result = operationStore(GetManagedStructuresDocument, {});

		return {
			props: {
				result,
			},
		};
	};
</script>

<script lang="ts">
	import LoaderIndicator from '$lib/ui/utils/LoaderIndicator.svelte';

	import StructureList from './StructureList.svelte';

	export let structureResult = operationStore(GetManagedStructuresDocument, {});

	query(structureResult);

	$: structures = $structureResult.data?.structures.map((data) => ({
		name: data.name,
		city: data.city,
		nbAdmin: data.admins_aggregate.aggregate.count,
		nbBeneficiary: data.beneficiaries_aggregate.aggregate.count,
		nbProfessional: data.professionals_aggregate.aggregate.count,
	}));
</script>

<svelte:head>
	<title>Gestion des structures - Carnet de bord</title>
</svelte:head>

<LoaderIndicator result={structureResult}>
	<div class="flex flex-col gap-8">
		<h1 class="fr-h4">Mes structures</h1>

		<StructureList {structures} />
	</div>
</LoaderIndicator>
