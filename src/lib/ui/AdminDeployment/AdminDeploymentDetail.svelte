<script lang="ts">
	import type {
		BeneficiaryAggregate,
		Deployment,
		Manager,
		ProfessionalAggregate,
		StructureAggregate,
	} from '$lib/graphql/_gen/typed-document-nodes';
	import { displayFullName } from '$lib/ui/format';
	import Dialog from '$lib/ui/Dialog.svelte';
	import AdminDeploymentStructuresImport from './AdminDeploymentStructuresImport.svelte';
	import AdminDeploymentProfessionalsImport from './AdminDeploymentProfessionalsImport.svelte';
	import AdminDeploymentBeneficiariesImport from './AdminDeploymentBeneficiariesImport.svelte';
	import type { OperationStore } from '@urql/svelte';

	type StructureAggregateSub = Pick<StructureAggregate, 'aggregate'>;
	type BeneficiariesAggregateSub = Pick<BeneficiaryAggregate, 'aggregate'>;
	type ManagerSub = Pick<Manager, 'id' | 'firstname' | 'lastname'>;

	export let deployment: Pick<Deployment, 'label' | 'id'> & {
		managers: ManagerSub[];
		structures_aggregate: StructureAggregateSub;
		beneficiaries_aggregate: BeneficiariesAggregateSub;
	};

	type ProfessionalAggregateSub = Pick<ProfessionalAggregate, 'aggregate'>;

	export let professional_aggregate: ProfessionalAggregateSub;
	export let store: OperationStore;

	function refreshStore() {
		$store.reexecute({ requestPolicy: 'network-only' });
	}
</script>

<h1 class="fr-h2">
	Déploiement <span class="text-france-blue-500">{deployment?.label ?? ''}</span>
</h1>
<div>Référent&nbsp;: {deployment?.managers.map((item) => displayFullName(item)).join(', ')}</div>
<div class="fr-container--fluid">
	<div class="fr-grid-row fr-grid-row--gutters">
		<div class="fr-col-md-3 fr-m-2v fr-p-4v bg-gray-bg">
			{deployment?.structures_aggregate.aggregate.count} <br /> Structures
		</div>
		<div class="fr-col-md-3 fr-m-2v fr-p-4v bg-gray-bg">
			{professional_aggregate?.aggregate.count} <br /> Professionnels
		</div>
		<div class="fr-col-md-3 fr-m-2v fr-p-4v bg-gray-bg">
			{deployment?.beneficiaries_aggregate.aggregate.count} <br /> Bénéficiaires
		</div>
	</div>
	<div class="fr-grid-row fr-grid-row--gutters">
		<div class="fr-col-md-3 fr-m-2v fr-p-4v">
			<Dialog
				label="Importer des structures"
				buttonLabel="Importer des structures"
				title="Importer des structures"
				size={'large'}
				showButtons={false}
				on:close={refreshStore}
			>
				<AdminDeploymentStructuresImport deploymentId={deployment?.id} />
			</Dialog>
		</div>
		<div class="fr-col-md-3 fr-m-2v fr-p-4v">
			<Dialog
				label="Importer des professionnels"
				buttonLabel="Importer des professionnels"
				title="Importer des professionnels"
				size={'large'}
				showButtons={false}
				on:close={refreshStore}
			>
				<AdminDeploymentProfessionalsImport deploymentId={deployment?.id} />
			</Dialog>
		</div>
		<div class="fr-col-md-3 fr-m-2v fr-p-4v">
			<Dialog
				label="Importer des bénéficiaires"
				buttonLabel="Importer des bénéficiaires"
				title="Importer des bénéficiaires"
				size={'large'}
				showButtons={false}
				on:close={refreshStore}
			>
				<AdminDeploymentBeneficiariesImport deploymentId={deployment?.id} />
			</Dialog>
		</div>
	</div>
</div>
