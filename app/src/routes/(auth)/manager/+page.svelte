<script lang="ts">
	import { connectedUser } from '$lib/stores';
	import { GetDeploymentInfosDocument } from '$lib/graphql/_gen/typed-document-nodes';
	import { pluralize } from '$lib/helpers';
	import ImportBeneficiaries from '$lib/ui/Manager/ImportBeneficiaries.svelte';
	import ImportStructures from '$lib/ui/Manager/ImportStructures.svelte';
	import Dialog from '$lib/ui/Dialog.svelte';
	import LoaderIndicator from '$lib/ui/utils/LoaderIndicator.svelte';

	import { operationStore, query } from '@urql/svelte';
	import UpdateNotebookMembers from '$lib/ui/Manager/UpdateNotebookMembers.svelte';
	import ImportOrientationManager from '$lib/ui/Manager/ImportOrientationManager.svelte';

	const deploymentId = $connectedUser.deploymentId;
	const result = operationStore(
		GetDeploymentInfosDocument,
		{ id: deploymentId },
		{
			requestPolicy: 'network-only',
			additionalTypenames: ['structure', 'professional', 'beneficiary', 'notebook_member'],
		}
	);

	query(result);

	$: deploymentInfo = $result.data;
	$: structures = deploymentInfo?.structuresWithPros;
	$: professionals = structures?.flatMap((structure) => {
		const structureId = structure.id;
		return structure.professionals.map((pro) => ({
			...pro,
			structureId,
		}));
	});

	function colorize(quantity: number, flip = false) {
		const success = flip ? quantity === 0 : quantity !== 0;
		return success ? '!text-success' : '!text-marianne-red';
	}

	function refreshMetrics() {
		return result.reexecute({ requestPolicy: 'network-only' });
	}
</script>

<LoaderIndicator {result}>
	<h1 class="fr-h2 fr-mt-6w">{deploymentInfo.deployment.label}</h1>
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
		<div class="fr-col-sm-4 flex">
			<Dialog
				label="Importer des structures"
				buttonLabel="Importer des structures"
				title="Importer des structures"
				size={'large'}
				showButtons={false}
				on:close={refreshMetrics}
			>
				<ImportStructures />
			</Dialog>
		</div>
		<div class="fr-col-sm-4 flex">
			<Dialog
				label="Importer des bénéficiaires"
				buttonLabel="Importer des bénéficiaires"
				title="Importer des bénéficiaires"
				size={'large'}
				showButtons={false}
				on:close={refreshMetrics}
			>
				<ImportBeneficiaries />
			</Dialog>
		</div>
		<div class="fr-col-sm-4 flex">
			<Dialog
				label="Procéder à des réorientations"
				title="Procéder à des réorientations"
				size={'large'}
				showButtons={false}
				on:close={refreshMetrics}
			>
				<svelte:fragment slot="buttonLabel">
					<span class="block w-44">Importer une liste de réorientations</span>
				</svelte:fragment>
				<UpdateNotebookMembers {professionals} {structures} />
			</Dialog>
		</div>
		<div class="fr-col-sm-4 flex">
			<Dialog
				label="Importer des chargés d'orientation"
				title="Importer des chargés d'orientation"
				size={'large'}
				showButtons={false}
				on:close={refreshMetrics}
			>
				<svelte:fragment slot="buttonLabel">
					<span class="block w-44">Importer une liste de chargés d'orientation</span>
				</svelte:fragment>
				<ImportOrientationManager />
			</Dialog>
		</div>
	</div>
</LoaderIndicator>
