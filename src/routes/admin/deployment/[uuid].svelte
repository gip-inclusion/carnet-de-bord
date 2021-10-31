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
	import AdminDeploymentDetail from '$lib/ui/AdminDeployment/AdminDeploymentDetail.svelte';

	export let deploymentId: string;
	const getDeploymentStore = operationStore(GetDeploymentByIdDocument, { id: deploymentId });
	query(getDeploymentStore);

	$: deployment = $getDeploymentStore?.data?.deployment;
	$: professional_aggregate = $getDeploymentStore?.data?.professional_aggregate;
</script>

<svelte:head>
	<title>Deploiment {deployment?.label} - carnet de bord</title>
</svelte:head>

<AdminDeploymentDetail {deployment} {professional_aggregate} />
