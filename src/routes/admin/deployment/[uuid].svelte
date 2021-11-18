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

	export let deploymentId: string;
	const getDeploymentStore = operationStore(
		GetDeploymentByIdDocument,
		{ id: deploymentId },
		{ additionalTypenames: ['structure', 'professional', 'beneficiary'] }
	);
	query(getDeploymentStore);

	$: deployment = $getDeploymentStore?.data?.deployment;
	$: professional_aggregate = $getDeploymentStore?.data?.professional_aggregate;
</script>

<svelte:head>
	<title>Déploiement {deployment?.label ?? ''} - Carnet de bord</title>
</svelte:head>
<LoaderIndicator result={getDeploymentStore}>
	<AdminDeploymentDetail {deployment} {professional_aggregate} store={getDeploymentStore}/>
</LoaderIndicator>
