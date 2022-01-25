<script lang="ts">
	import { session } from '$app/stores';

	import { GetDeploymentInfosDocument } from '$lib/graphql/_gen/typed-document-nodes';
	import AdminDeploymentStructuresImport from '$lib/ui/AdminDeployment/AdminDeploymentStructuresImport.svelte';
	import Button from '$lib/ui/base/Button.svelte';
	import Dialog from '$lib/ui/Dialog.svelte';
	import LoaderIndicator from '$lib/ui/utils/LoaderIndicator.svelte';

	import { operationStore, query } from '@urql/svelte';
	import { v4 } from 'uuid';
	const result = operationStore(GetDeploymentInfosDocument, { id: $session.user.deploymentId });
	query(result);

	function refreshStore() {
		$result.reexecute({ requestPolicy: 'network-only' });
	}

	$: deploymentInfo = $result.data;
</script>

<LoaderIndicator {result}>
	<h1 class="fr-h2">{deploymentInfo.deployment.label}</h1>
	<h2 class="fr-h4">État du territoire</h2>
	<div class="fr-grid-row fr-grid-row--gutters">
		<div class="fr-col-sm-6 fr-col-md-6 fr-col-lg-3">
			<strong class="block text-center fr-h3">
				{deploymentInfo.beneficiaries.aggregate.count}
			</strong>
			<p class="text-center">Nombre de bénéficiares importés sur le territoire</p>
		</div>
		<div class="fr-col-sm-6 fr-col-md-6 fr-col-lg-3 ">
			<strong class="block text-center fr-h3">
				{deploymentInfo.beneficiaries.aggregate.count}
			</strong>
			<p class="text-center">Nombre de bénéficiaires sans structure</p>
		</div>
		<div class="fr-col-sm-6 fr-col-md-6 fr-col-lg-3">
			<strong class="block text-center fr-h3">
				{deploymentInfo.structures.aggregate.count}
			</strong>
			<p class="text-center">Nombre de structures importées sur le territoire</p>
		</div>
		<div class="fr-col-sm-6 fr-col-md-6 fr-col-lg-3">
			<strong class="block text-center fr-h3">
				{deploymentInfo.structures.aggregate.count}
			</strong>
			<p class="text-center">Nombre de structures sans bénéficiaires</p>
		</div>
	</div>
	<h2 class="fr-h4">Importer des fichiers</h2>
	<div class="fr-grid-row fr-grid-row--gutters">
		<div class="fr-col-sm-6">
			<Dialog
				label="Importer des structures"
				buttonLabel="Importer des structures"
				title="Importer des structures"
				size={'large'}
				showButtons={false}
				on:close={refreshStore}
			>
				<AdminDeploymentStructuresImport deploymentId={v4()} />
			</Dialog>
		</div>
		<div class="fr-col-sm-6">
			<Button>Importer des bénéficiaires</Button>
		</div>
	</div>
</LoaderIndicator>
