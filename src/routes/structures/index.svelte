<script lang="ts" context="module">
	import { GetManagedStructuresDocument } from '$lib/graphql/_gen/typed-document-nodes';
	import type { Load } from '@sveltejs/kit';
	import { operationStore, query } from '@urql/svelte';
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
	import { account } from '$lib/stores';
	import LoaderIndicator from '$lib/ui/utils/LoaderIndicator.svelte';
	import StructureList from '$lib/ui/AdminStructure/StructureList.svelte';
	import { baseUrlForRole, homeForRole, Segment } from '$lib/routes';
	import { Breadcrumbs } from '$lib/ui/base';
	import { goto } from '$app/navigation';
	import { onMount } from 'svelte';
	import { pluralize } from '$lib/helpers';

	export let structureResult = operationStore(GetManagedStructuresDocument, {});

	query(structureResult);

	$: structures = $structureResult.data?.structures.map((data) => ({
		id: data.id,
		name: data.name,
		city: data.city,
		nbAdmin: data.admins_aggregate.aggregate.count,
		nbBeneficiary: data.beneficiaries_aggregate.aggregate.count,
		nbProfessional: data.professionals_aggregate.aggregate.count,
	}));

	const breadcrumbs: Segment[] = [
		{
			name: 'accueil',
			path: homeForRole('admin_structure'),
			label: 'Accueil',
		},
	];

	onMount(() => {
		if (!$account.onboardingDone) {
			goto(`${baseUrlForRole('admin_structure')}/bienvenue`);
		}
	});
</script>

<svelte:head>
	<title>Gestion des structures - Carnet de bord</title>
</svelte:head>

<Breadcrumbs segments={breadcrumbs} />
<LoaderIndicator result={structureResult}>
	<h1>{pluralize('Ma', structures.length, 'Mes')} {pluralize('structure', structures.length)}</h1>
	<StructureList {structures} />
</LoaderIndicator>
