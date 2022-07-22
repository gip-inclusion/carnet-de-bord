<script context="module" lang="ts">
	import { GetDeploymentByIdDocument } from '$lib/graphql/_gen/typed-document-nodes';
	import type { Load } from '@sveltejs/kit';
	import { operationStore, query } from '@urql/svelte';

	export const load: Load = ({ params }) => {
		const deploymentId = params.uuid;
		return {
			props: {
				deploymentId,
			},
		};
	};
</script>

<script lang="ts">
	import { AdminDeploymentView } from '$lib/ui/Deployment';
	import { LoaderIndicator } from '$lib/ui/utils';
	import { Breadcrumbs } from '$lib/ui/base';
	import ManagerTable from '$lib/ui/AdminHome/ManagerTable.svelte';

	export let deploymentId: string;
	const getDeploymentStore = operationStore(
		GetDeploymentByIdDocument,
		{ id: deploymentId },
		{ additionalTypenames: ['structure', 'professional', 'beneficiary'] }
	);
	query(getDeploymentStore);

	function refreshStore() {
		getDeploymentStore.reexecute({ requestPolicy: 'cache-and-network' });
	}

	$: deployment = $getDeploymentStore?.data?.deployment;
	$: professional_aggregate = $getDeploymentStore?.data?.professional_aggregate;
	$: breadcrumbs = [
		{
			name: 'accueil',
			path: '/admin',
			label: 'Accueil',
		},
		{
			name: 'deploiement',
			path: `/admin/deployment/$getDeploymentStore?.data?.deployment.id}`,
			label: `Déploiement ${$getDeploymentStore?.data?.deployment.label}`,
		},
	];
</script>

<svelte:head>
	<title>Déploiement {deployment?.label ?? ''} - Carnet de bord</title>
</svelte:head>

<LoaderIndicator result={getDeploymentStore}>
	<Breadcrumbs segments={breadcrumbs} />
	<div class="flex flex-col gap-8">
		<AdminDeploymentView {deployment} {professional_aggregate} {refreshStore} />
		<ManagerTable managers={deployment.managers} />
	</div>
</LoaderIndicator>
