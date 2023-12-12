<script lang="ts">
	import type { GetProfessionalsForStructureQuery } from '$lib/graphql/_gen/typed-document-nodes';
	import { DeleteAccountDocument } from '$lib/graphql/_gen/typed-document-nodes';
	import { IconButton } from '../base';
	import Dialog from '$lib/ui/Dialog.svelte';
	import { openComponent } from '$lib/stores';
	import EditProfessionalAccountLayer from '$lib/ui/ProfessionalList/EditProfessionalAccountLayer.svelte';
	import { mutation, operationStore } from '@urql/svelte';
	import { displayFullName } from '../format';

	type Professional = GetProfessionalsForStructureQuery['professional'][0];

	export let professionals: Professional[];

	function openEditProfessionalAccountLayer(professional: Professional) {
		openComponent.open({
			component: EditProfessionalAccountLayer,
			props: { professional },
		});
	}

	const deleteAccountMutation = operationStore(DeleteAccountDocument);
	const deleteAccount = mutation(deleteAccountMutation);

	async function removeProfessional(professional: Professional) {
		const dateObj = new Date();
		const month = dateObj.getUTCMonth() + 1;
		const day = dateObj.getUTCDate();
		const year = dateObj.getUTCFullYear();
		const suffix = '.deleted' + day + month + year;
		const newEmail = professional.email + suffix;
		const newUsername = professional.account.username + suffix;

		await deleteAccount({
			accountId: professional.account.id,
			professionalId: professional.id,
			newEmail: newEmail,
			newUsername: newUsername,
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
						title={`liste des bénéficiaires de ${displayFullName(professional)}`}
						class="fr-tag fr-tag-sm"
						class:fr-tag--purple-glycine={hasNoBeneficiaries}
					>
						{beneficiariesCount}
					</a>
				</td>
				<td class="text-right">
					<IconButton
						class="fr-btn--sm fr-btn--tertiary fr-btn--tertiary-no-outline"
						icon="fr-icon-edit-line"
						title="Mettre à jour"
						on:click={() => openEditProfessionalAccountLayer(professional)}
					/>
					<Dialog
						buttonCssClasses="fr-btn--sm fr-btn--tertiary fr-btn--tertiary-no-outline"
						buttonIcon="fr-icon-delete-bin-line"
						title="Supprimer"
						buttonLabel={null}
						label="Supprimer"
						on:confirm={() => removeProfessional(professional)}
					>
						<p>
							Vous allez supprimer le compte de
							<strong>{displayFullName(professional)}</strong>.
							<br />Veuillez confirmer la suppression.
						</p>
					</Dialog>
				</td>
			</tr>
		{/each}
		{#if professionals.length === 0}
			<tr><td colspan="6">Aucun professionel.</td></tr>
		{/if}
	</tbody>
</table>
