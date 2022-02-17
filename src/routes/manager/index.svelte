<script lang="ts">
	import { session } from '$app/stores';

	import { GetDeploymentInfosDocument } from '$lib/graphql/_gen/typed-document-nodes';
	import { pluralize } from '$lib/helpers';
	import ImportBeneficiaries from '$lib/ui/Manager/ImportBeneficiaries.svelte';
	import ImportStructures from '$lib/ui/Manager/ImportStructures.svelte';
	import Dialog from '$lib/ui/Dialog.svelte';
	import LoaderIndicator from '$lib/ui/utils/LoaderIndicator.svelte';

	import { operationStore, query } from '@urql/svelte';
	const deploymentId = $session.user.deploymentId;
	const result = operationStore(GetDeploymentInfosDocument, { id: deploymentId });
	query(result);

	function refreshStore() {
		$result.reexecute({ requestPolicy: 'network-only' });
	}

	$: deploymentInfo = $result.data;

	function colorize(quantity: number, flip = false) {
		const success = flip ? quantity === 0 : quantity !== 0;
		return success ? '!text-success' : '!text-marianne-red';
	}
</script>

<LoaderIndicator {result}>
	<h1 class="fr-h2">{deploymentInfo.deployment.label}</h1>
	<h2 class="fr-h4">État du territoire</h2>
	<div class="fr-grid-row fr-grid-row--gutters">
		<div class="fr-col-sm-6 fr-col-md-6 fr-col-lg-3">
			<strong class="block text-center fr-h3">
				{deploymentInfo.beneficiaries.aggregate.count}
			</strong>
			<p class="text-center">
				{pluralize('bénéficiaire', deploymentInfo.beneficiaries.aggregate.count)} sur le territoire
			</p>
		</div>
		<div class="fr-col-sm-6 fr-col-md-6 fr-col-lg-3 ">
			<strong
				class="block text-center fr-h3 {colorize(
					deploymentInfo.beneficiariesWithNoStructure.aggregate.count,
					true
				)}"
			>
				{deploymentInfo.beneficiariesWithNoStructure.aggregate.count}
			</strong>
			<p
				class="text-center {colorize(
					deploymentInfo.beneficiariesWithNoStructure.aggregate.count,
					true
				)}"
			>
				{pluralize('bénéficiaire', deploymentInfo.beneficiariesWithNoStructure.aggregate.count)} sans
				structure
			</p>
		</div>
		<div class="fr-col-sm-6 fr-col-md-6 fr-col-lg-3">
			<strong class="block text-center fr-h3">
				{deploymentInfo.structures.aggregate.count}
			</strong>
			<p class="text-center">
				{pluralize('structure', deploymentInfo.structures.aggregate.count)} sur le territoire
			</p>
		</div>
		<div class="fr-col-sm-6 fr-col-md-6 fr-col-lg-3">
			<strong
				class="block text-center fr-h3 {colorize(
					deploymentInfo.structuresWithNoBeneficiary.aggregate.count,
					true
				)}"
			>
				{deploymentInfo.structuresWithNoBeneficiary.aggregate.count}
			</strong>
			<p
				class="text-center {colorize(
					deploymentInfo.structuresWithNoBeneficiary.aggregate.count,
					true
				)}"
			>
				{pluralize('structure', deploymentInfo.structuresWithNoBeneficiary.aggregate.count)} sans bénéficiaires
			</p>
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
				<ImportStructures />
			</Dialog>
		</div>
		<div class="fr-col-sm-6">
			<Dialog
				label="Importer des bénéficiaires"
				buttonLabel="Importer des bénéficiaires"
				title="Importer des bénéficiaires"
				size={'large'}
				showButtons={false}
				on:close={refreshStore}
			>
				<ImportBeneficiaries />
			</Dialog>
		</div>
	</div>
</LoaderIndicator>
