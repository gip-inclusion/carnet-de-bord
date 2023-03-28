<script lang="ts">
	import { GetDeploymentsDocument } from '$lib/graphql/_gen/typed-document-nodes';
	import type { Segment } from '$lib/routes';

	import { openComponent } from '$lib/stores';
	import { AdminDeploymentCreateLayer, AdminDeploymentList } from '$lib/ui/Deployment';
	import { Breadcrumbs, Button } from '$lib/ui/base';
	import { operationStore, query } from '@urql/svelte';

	const deploymentsStore = operationStore(GetDeploymentsDocument);
	query(deploymentsStore);

	function onAddDeployementClick() {
		openComponent.open({
			component: AdminDeploymentCreateLayer,
			props: {
				onClose: refreshDeploymentList,
			},
		});
	}

	function refreshDeploymentList() {
		deploymentsStore.reexecute({ requestPolicy: 'network-only' });
	}

	const breadcrumbs: Segment[] = [
		{
			name: 'accueil',
			path: '/admin',
			label: 'Accueil',
		},
	];
</script>

<svelte:head>
	<title>Gestion des déploiements - Carnet de bord</title>
</svelte:head>

<Breadcrumbs segments={breadcrumbs} />

<div class="flex flex-col gap-8">
	<h1 class="fr-h4">Liste des déploiements</h1>

	<div><Button on:click={onAddDeployementClick}>Ajouter un Déploiement</Button></div>

	<AdminDeploymentList {deploymentsStore} />
</div>
