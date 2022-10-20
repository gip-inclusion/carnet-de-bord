<script lang="ts">
	import { GetManagedStructuresDocument, RoleEnum } from '$lib/graphql/_gen/typed-document-nodes';
	import { operationStore, query } from '@urql/svelte';
	import { account } from '$lib/stores';
	import StructureList from '$lib/ui/AdminStructure/StructureList.svelte';
	import { homeForRole, type Segment } from '$lib/routes';
	import { pluralize } from '$lib/helpers';

	import { Breadcrumbs } from '$lib/ui/base';
	import { LoaderIndicator } from '$lib/ui/utils';

	export let structureResult = operationStore(GetManagedStructuresDocument, {
		adminId: $account.id,
	});

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
			path: homeForRole(RoleEnum.AdminStructure),
			label: 'Accueil',
		},
	];
</script>

<svelte:head>
	<title>Gestion des structures - Carnet de bord</title>
</svelte:head>

<Breadcrumbs segments={breadcrumbs} />
<LoaderIndicator result={structureResult}>
	<h1>{pluralize('Ma', structures.length, 'Mes')} {pluralize('structure', structures.length)}</h1>
	<StructureList {structures} />
</LoaderIndicator>
