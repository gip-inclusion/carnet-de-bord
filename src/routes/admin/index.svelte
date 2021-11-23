<script lang="ts">
	import { GetDeploymentsDocument } from '$lib/graphql/_gen/typed-document-nodes';
	import type { Segment } from '$lib/routes';

	import { openComponent } from '$lib/stores';
	import { AdminDeploymentList, AdminDeploymentCreateLayer } from '$lib/ui/AdminDeployment';
	import { Button } from '$lib/ui/base';
	import Breadcrumbs from '$lib/ui/base/Breadcrumbs.svelte';
	import { operationStore, query } from '@urql/svelte';

	const deploymentsStore = operationStore(GetDeploymentsDocument);
	query(deploymentsStore);

	function onAddDeployementClick() {
		openComponent.open({ component: AdminDeploymentCreateLayer });
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
	<Button on:click={onAddDeployementClick}>Ajouter un Déploiement</Button>

	<AdminDeploymentList {deploymentsStore} />
</div>
