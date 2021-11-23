<script context="module" lang="ts">
	import { GetDeploymentByIdDocument } from '$lib/graphql/_gen/typed-document-nodes';
	import type { Load } from '@sveltejs/kit';
	import { operationStore, query } from '@urql/svelte';

	export const load: Load = ({ page }) => {
		const deploymentId = page.params.uuid;
		return {
			props: {
				deploymentId,
			},
		};
	};
</script>

<script lang="ts">
	import { AdminDeploymentDetail } from '$lib/ui/AdminDeployment';
	import { LoaderIndicator } from '$lib/ui/utils';
	import Breadcrumbs from '$lib/ui/base/Breadcrumbs.svelte';

	export let deploymentId: string;
	const getDeploymentStore = operationStore(
		GetDeploymentByIdDocument,
		{ id: deploymentId },
		{ additionalTypenames: ['structure', 'professional', 'beneficiary'] }
	);
	query(getDeploymentStore);

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
			label: `déploiement ${$getDeploymentStore?.data?.deployment.label}`,
		},
	];
</script>

<svelte:head>
	<title>Déploiement {deployment?.label ?? ''} - Carnet de bord</title>
</svelte:head>

<LoaderIndicator result={getDeploymentStore}>
	<Breadcrumbs segments={breadcrumbs} />
	<div class="flex flex-col gap-8">
		<AdminDeploymentDetail {deployment} {professional_aggregate} store={getDeploymentStore} />/>
	</div>
</LoaderIndicator>
