<script lang="ts">
	import { baseUrlForRole } from '$lib/routes';

	import type { StructureCard } from '../../../routes/structures/index.svelte';

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
						<li>{structure.nbAdmin} administrateur{structure.nbAdmin > 1 ? 's' : ''}</li>
						<li>
							{structure.nbProfessional} accompagnateur{structure.nbProfessional > 1 ? 's' : ''}
						</li>
						<li>{structure.nbBeneficiary} bénéficiaire{structure.nbBeneficiary > 1 ? 's' : ''}</li>
					</ul>
					<p class="fr-card__detail">{structure.city}</p>
				</div>
			</div>
		</div>
	{/each}
</div>
