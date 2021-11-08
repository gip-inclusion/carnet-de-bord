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

	const title = 'Importer des structures';
	const buttonLabel = 'Importer des structures';
	const label = "Confirmer l'import";
</script>

<h1 class="fr-h2">
	Déploiement <span class="text-france-blue-500">{deployment?.label ?? ''}</span>
</h1>
<p>Référent&nbsp;: {deployment?.managers.map((item) => displayFullName(item)).join(', ')}</p>
<div class="fr-container--fluid fr-my-6w">
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
			<div class="flex">
				<Dialog {label} {buttonLabel} {title} size={'large'} showButtons={false}>
					<AdminDeploymentStructuresImport deploymentId={deployment?.id} />
				</Dialog>
			</div>
		</div>
	</div>
</div>
