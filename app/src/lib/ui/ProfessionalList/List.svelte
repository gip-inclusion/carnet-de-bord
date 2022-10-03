<script lang="ts">
	import type { GetProfessionalsForStructureQuery } from '$lib/graphql/_gen/typed-document-nodes';
	import { Button } from '../base';
	import { openComponent } from '$lib/stores';
	import EditProfessionalAccountLayer from '$lib/ui/ProfessionalList/EditProfessionalAccountLayer.svelte';
	import { displayFullName } from '../format';

	type Professional = GetProfessionalsForStructureQuery['professional'][0];

	export let professionals: Professional[];

	function openEditProfessionalAccountLayer(professional: Professional) {
		openComponent.open({
			component: EditProfessionalAccountLayer,
			props: { professional },
		});
	}
</script>

<table class="w-full fr-table fr-table--layout-fixed">
	<caption class="sr-only">Liste des professionnels</caption>
	<thead>
		<tr>
			<th class="text-left">Prénom nom</th>
			<th class="text-left">Téléphone</th>
			<th class="text-left">Email</th>
			<th class="text-left">Onboarding</th>
			<th class="text-right">BRSA suivis</th>
			<th class="text-right">Gérer</th>
		</tr>
	</thead>
	<tbody>
		{#each professionals as professional}
			{@const beneficiariesCount =
				professional.account.notebooksWhereMember_aggregate.aggregate.count}
			{@const hasNoBeneficiaries = beneficiariesCount === 0}
			<tr>
				<td>{displayFullName(professional)}</td>
				<td>{professional.mobileNumber ?? '--'}</td>
				<td>{professional.email}</td>
				<td>{professional.account.onboardingDone ? 'Fait' : 'Non fait'}</td>
				<td class="flex justify-end">
					<a
						href={`beneficiaires?member=${professional.email}`}
						title={`liste des bénéficiaires de ${professional.firstname} ${professional.lastname}`}
						class="fr-tag fr-tag-sm"
						class:fr-tag--purple-glycine={hasNoBeneficiaries}
					>
						{beneficiariesCount}
					</a>
				</td>
				<td class="text-right">
					<Button
						classNames="fr-btn--sm fr-btn--secondary"
						icon="fr-icon-edit-line"
						title="Mettre à jour"
						on:click={() => openEditProfessionalAccountLayer(professional)}>Mettre à jour</Button
					>
				</td>
			</tr>
		{/each}
		{#if professionals.length === 0}
			<tr><td colspan="6">Aucun professionel.</td></tr>
		{/if}
	</tbody>
</table>
