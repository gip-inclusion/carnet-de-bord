<script lang="ts">
	import {
		GetProfessionalsFromStructuresDocument,
		type GetProfessionalsFromStructuresQuery,
		UpdateReferentDocument,
		type GetBeneficiariesQuery,
		RoleEnum,
	} from '$lib/graphql/_gen/typed-document-nodes';
	import { Checkbox, Select } from '../base';
	import { displayFullName } from '../format';
	import { mutation, operationStore, query } from '@urql/svelte';
	import type { OperationStore } from '@urql/svelte';
	import Button from '../base/Button.svelte';
	import { openComponent } from '$lib/stores';
	import Alert from '../base/Alert.svelte';
	import { pluralize } from '$lib/helpers';
	import LoaderIndicator from '$lib/ui/utils/LoaderIndicator.svelte';
	import { trackEvent } from '$lib/tracking/matomo';

	export let structureId: string;
	export let notebooks: {
		id: string;
		members: GetBeneficiariesQuery['beneficiaries'][0]['notebook']['members'];
	}[];
	export let onBeneficiaryOrientationChanged: () => void;

	const professionalStore: OperationStore<GetProfessionalsFromStructuresQuery> = operationStore(
		GetProfessionalsFromStructuresDocument,
		{ id: structureId }
	);

	query(professionalStore);
	$: showResetMembers = notebooks.some((notebook) =>
		notebook.members.some((member) => member.account.type === RoleEnum.Professional)
	);
	$: professionalOptions =
		$professionalStore.data?.professional.map((pro) => ({
			name: pro.account.id,
			label: displayFullName(pro),
		})) ?? [];

	const updateReferent = mutation({ query: UpdateReferentDocument });

	let selectedMember;
	let shouldRemoveFormerReferent = false;
	let error = false;

	async function handleSubmit() {
		trackEvent('notebook_members', 'assign new referents');
		const updateResponse = await updateReferent(
			{
				newNotebookMemberRows: notebooks.flatMap((notebook) => {
					const rows = [
						{
							notebookId: notebook.id,
							memberType: 'referent',
							accountId: selectedMember,
							active: true,
						},
					];
					if (!shouldRemoveFormerReferent) {
						const formerReferent = notebook.members.find(
							(member) => member.account.type === RoleEnum.Professional
						);
						if (formerReferent) {
							rows.push({
								notebookId: notebook.id,
								memberType: 'no_referent',
								accountId: formerReferent.account.id,
								active: true,
							});
						}
					}
					return rows;
				}),
				newReferent: selectedMember,
				notebooks: notebooks.map(({ id }) => id),
			},
			{ additionalTypenames: ['notebook_member'] }
		);
		if (updateResponse.error) {
			error = true;
			console.error(updateResponse.error);
			return;
		}
		onBeneficiaryOrientationChanged();
		openComponent.close();
	}
	function close() {
		openComponent.close();
	}
</script>

<section class="flex flex-col w-full">
	<h1>Rattacher des bénéficiaires</h1>
	<form on:submit|preventDefault={handleSubmit}>
		<LoaderIndicator result={professionalStore}>
			<p>
				Veuillez sélectionner le nouveau référent unique {pluralize('du', notebooks.length, 'des')}
				{pluralize('bénéficiaire', notebooks.length)}.
			</p>
			<Select
				bind:selected={selectedMember}
				selectLabel={showResetMembers ? 'Nom du nouveau référent' : 'Nom du référent'}
				selectHint="Sélectionner un professionnel"
				options={professionalOptions}
				name="professional"
				id="professional"
			/>
			{#if showResetMembers}
				<Checkbox
					label="Retirer l'ancien référent du groupe de suivi."
					name="reset"
					bind:checked={shouldRemoveFormerReferent}
				/>
			{/if}
			{#if error}
				<Alert type="error" size="sm">Impossible de modifier le rattachement</Alert>
			{/if}
			<div class="pt-4">
				<Button type="submit">Rattacher</Button>
				<Button outline on:click={close}>Annuler</Button>
			</div>
		</LoaderIndicator>
	</form>
</section>
