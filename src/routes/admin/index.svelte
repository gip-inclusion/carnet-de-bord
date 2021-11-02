<script>
	import { GetDeploymentsDocument } from '$lib/graphql/_gen/typed-document-nodes';

	import { openComponent } from '$lib/stores';
	import AdminDeploymentCreateLayer from '$lib/ui/AdminDeployment/AdminDeploymentCreateLayer.svelte';
	import AdminDeploymentList from '$lib/ui/AdminDeployment/AdminDeploymentList.svelte';
	import { Button } from '$lib/ui/base';
	import { operationStore, query } from '@urql/svelte';

	const deploymentsStore = operationStore(GetDeploymentsDocument);
	query(deploymentsStore);

	function onAddDeployementClick() {
		openComponent.open({ component: AdminDeploymentCreateLayer });
	}
</script>

<svelte:head>
	<title>Gestion des déploiements - Carnet de bord</title>
</svelte:head>

<Button on:click={onAddDeployementClick}>Ajouter un Déploiment</Button>

<AdminDeploymentList {deploymentsStore} />
