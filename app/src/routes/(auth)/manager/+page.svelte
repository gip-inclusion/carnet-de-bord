<script lang="ts">
	import { connectedUser } from '$lib/stores';
	import { GetDeploymentInfosDocument, RoleEnum } from '$lib/graphql/_gen/typed-document-nodes';
	import { pluralize } from '$lib/helpers';
	import ImportBeneficiaries from '$lib/ui/Manager/ImportBeneficiaries.svelte';
	import ImportStructures from '$lib/ui/Manager/ImportStructures.svelte';
	import ImportCafMsa from '$lib/ui/Manager/ImportCafMsa.svelte';
	import Dialog from '$lib/ui/Dialog.svelte';
	import LoaderIndicator from '$lib/ui/utils/LoaderIndicator.svelte';

	import { operationStore, query } from '@urql/svelte';
	import UpdateNotebookMembers from '$lib/ui/Manager/UpdateNotebookMembers.svelte';
	import ImportOrientationManager from '$lib/ui/Manager/ImportOrientationManager.svelte';
	import Card from '$lib/ui/base/Card.svelte';
	import { baseUrlForRole } from '$lib/routes';

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

	$: beneficiaryCount = $result.data?.beneficiaries.aggregate.count ?? 0;
	$: beneficiaryWithoutStructureCount =
		$result.data?.beneficiariesWithNoStructure.aggregate.count ?? 0;
	$: structureCount = $result.data?.structures.aggregate.count ?? 0;
	$: structuresWithNoBeneficiaryCount =
		$result.data?.structuresWithNoBeneficiary.aggregate.count ?? 0;

	$: structures = $result.data?.structuresWithPros;
	$: professionals = structures?.flatMap((structure) => {
		const structureId = structure.id;
		return structure.professionals.map((pro) => ({
			...pro,
			structureId,
		}));
	});

	function refreshMetrics() {
		return result.reexecute({ requestPolicy: 'network-only' });
	}
	$: metrics = [
		{
			label: `${pluralize('Bénéficiaire', beneficiaryCount)} sur le territoire`,
			amount: beneficiaryCount,
			link: `${baseUrlForRole(RoleEnum.Manager)}/beneficiaires?filter=tous`,
		},
		{
			label: `${pluralize('Bénéficiaire', beneficiaryWithoutStructureCount)} non accompagné`,
			amount: beneficiaryWithoutStructureCount,
			classNames: beneficiaryWithoutStructureCount > 0 ? 'text-marianne-red' : 'text-success',
			link: `${baseUrlForRole(RoleEnum.Manager)}/beneficiaires?filter=sans-structure`,
		},
		{
			label: `${pluralize('Structure', structureCount)} sur le territoire`,
			amount: structureCount,
			link: `${baseUrlForRole(RoleEnum.Manager)}/structures`,
		},
		{
			label: `${pluralize('Structure', structuresWithNoBeneficiaryCount)} sans bénéficiaire`,
			amount: structuresWithNoBeneficiaryCount,
			classNames: structuresWithNoBeneficiaryCount > 0 ? 'text-marianne-red' : 'text-success',
		},
	];
</script>

<LoaderIndicator {result}>
	<h1 class="fr-h2 fr-mt-6w">{$result.data.deployment.label}</h1>
	<h2 class="fr-h4">État du territoire</h2>
	<div class="fr-grid-row fr-grid-row--gutters">
		{#each metrics as item (item.label)}
			<div class="fr-col-sm-6 fr-col-md-3 fr-col-lg-3">
				<Card horizontal={true} hideArrow={!item.link} href={item.link}>
					<div slot="title">
						<div
							class={`pb-1 flex flex-row font-bold text-3xl tracking-wider ${
								item.classNames || ''
							}`}
						>
							{item.amount}
						</div>
						<span class={`font-normal leading-6 text-sm ${item.classNames}`}>{item.label}</span>
					</div>
				</Card>
			</div>
		{/each}
	</div>

	<h2 class="fr-h4 fr-mt-6w">Importer des fichiers</h2>
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
		<div class="fr-col-sm-4 flex">
			<Dialog
				label="Importer un fichier CAF/MSA"
				title="Importer un fichier CAF/MSA"
				size={'large'}
				showButtons={false}
			>
				<svelte:fragment slot="buttonLabel">
					<span class="block w-44">Importer un fichier CAF/MSA</span>
				</svelte:fragment>
				<ImportCafMsa />
			</Dialog>
		</div>
	</div>
</LoaderIndicator>
