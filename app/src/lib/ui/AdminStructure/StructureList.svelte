<script lang="ts">
	import { pluralize } from '$lib/helpers';

	import { baseUrlForRole } from '$lib/routes';

	type StructureCard = {
		id: string;
		name: string;
		city: string;
		nbAdmin: number;
		nbProfessional: number;
		beneficiaryCount: number;
	};
	export let structures: StructureCard[];
</script>

<div class="fr-grid-row fr-grid-row--gutters">
	{#each structures as structure}
		<div class="fr-col-6 fr-col-md-4">
			<div class="fr-card fr-card--horizontal fr-enlarge-link">
				<div class="fr-card__body">
					<h4 class="fr-card__title">
						<a href={`${baseUrlForRole('admin_structure')}/${structure.id}`} class="fr-card__link"
							>{structure.name}</a
						>
					</h4>
					<ul class="list-none pl-0 fr-card__desc">
						<li>{structure.nbAdmin} {pluralize('administrateur', structure.nbAdmin)}</li>
						<li>
							{structure.nbProfessional}
							{pluralize('accompagnateur', structure.nbProfessional)}
						</li>
						<li>
							{structure.beneficiaryCount}
							{pluralize('bénéficiaire', structure.beneficiaryCount)}
						</li>
					</ul>
					<p class="fr-card__detail">{structure.city}</p>
				</div>
			</div>
		</div>
	{/each}
</div>
