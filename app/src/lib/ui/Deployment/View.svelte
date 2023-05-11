<script lang="ts">
	import type {
		BeneficiaryAggregate,
		Deployment,
		Manager,
		ProfessionalAggregate,
		StructureAggregate,
	} from '$lib/graphql/_gen/typed-document-nodes';
	import Button from '../base/Button.svelte';
	import AdminCreate from '../AdminCreate/AdminCreate.svelte';
	import { openComponent } from '$lib/stores';
	import Card from '$lib/ui/base/Card.svelte';

	type StructureAggregateSub = Pick<StructureAggregate, 'aggregate'>;
	type BeneficiariesAggregateSub = Pick<BeneficiaryAggregate, 'aggregate'>;
	type ManagerSub = Pick<Manager, 'id' | 'firstname' | 'lastname'>;

	export let deployment: Pick<Deployment, 'label' | 'id' | 'config'> & {
		managers: ManagerSub[];
		structures_aggregate: StructureAggregateSub;
		beneficiaries_aggregate: BeneficiariesAggregateSub;
	};

	type ProfessionalAggregateSub = Pick<ProfessionalAggregate, 'aggregate'>;

	export let professional_aggregate: ProfessionalAggregateSub;
	export let refreshStore: () => void;

	function onAddManagerClick() {
		openComponent.open({
			component: AdminCreate,
			props: {
				deploymentId: deployment.id,
				onClose: () => {
					refreshStore();
				},
			},
		});
	}
</script>

<h1 class="fr-h2">
	Déploiement <span class="text-vert-cdb-500">{deployment?.label ?? ''}</span>
</h1>
<div class="flex justify-between items-center">
	<Button classNames="self-end" on:click={onAddManagerClick}
		>Ajouter un administrateur de territoire</Button
	>
</div>
<div class="fr-container--fluid">
	<div class="fr-grid-row fr-grid-row--gutters">
		<div class="fr-col">
			<Card horizontal href={`${deployment.id}/structures`}>
				<div slot="title">
					<div class="pb-1 flex flex-row font-bold text-3xl tracking-wider">
						{deployment?.structures_aggregate.aggregate.count}
						<span class="sr-only">structures</span>
					</div>
				</div>
				<p slot="actions" class="fr-card__detail">
					<span class="font-normal leading-6 text-sm" aria-hidden>Structures</span>
				</p>
			</Card>
		</div>
		<div class="fr-col">
			<Card horizontal hideArrow class="fr-card--grey">
				<div slot="title">
					<div class="pb-1 flex flex-row font-bold text-3xl tracking-wider">
						{professional_aggregate?.aggregate.count}
					</div>
				</div>
				<p slot="actions" class="fr-card__detail">
					<span class="font-normal leading-6 text-sm">Professionnels</span>
				</p>
			</Card>
		</div>
		<div class="fr-col">
			<Card horizontal hideArrow class="fr-card--grey">
				<div slot="title">
					<div class="pb-1 flex flex-row font-bold text-3xl tracking-wider">
						{deployment?.beneficiaries_aggregate.aggregate.count}
					</div>
				</div>
				<p slot="actions" class="fr-card__detail">
					<span class="font-normal leading-6 text-sm">Bénéficiaires</span>
				</p>
			</Card>
		</div>
	</div>
</div>
