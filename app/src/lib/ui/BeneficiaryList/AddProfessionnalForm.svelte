<script lang="ts">
	import {
		GetProfessionalsFromStructuresDocument,
		type GetProfessionalsFromStructuresQuery,
		RemoveReferentDocument,
		UpdateReferentDocument,
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

	export let member: string = null;
	export let notebooks: { beneficiaryId: string; notebookId: string }[];
	export let showResetMembers = false;
	export let structureId: string = null;

	export let onClose: () => void;

	let professionalStore: OperationStore<GetProfessionalsFromStructuresQuery> = operationStore(
		GetProfessionalsFromStructuresDocument,
		{ id: structureId }
	);
	query(professionalStore);

	$: professionalOptions =
		$professionalStore.data?.professional.map((pro) => ({
			name: pro.account.id,
			label: displayFullName(pro),
		})) ?? [];
	const deleteReferent = mutation({ query: RemoveReferentDocument });
	const updateReferent = mutation({ query: UpdateReferentDocument });

	let selectedMember = member;
	let resetMembers: boolean;
	let error = false;

	async function handleSubmit() {
		if (resetMembers) {
			const deleteResponse = await deleteReferent({
				notebooks: notebooks.map(({ notebookId }) => notebookId),
			});
			if (deleteResponse.error) {
				error = true;
				console.error(deleteResponse.error);
				return;
			}
		}
		const updateResponse = await updateReferent(
			{
				objects: notebooks.map(({ notebookId }) => ({
					notebookId,
					memberType: 'referent',
					accountId: selectedMember,
					active: true,
				})),
				beneficiaries: notebooks.map(({ beneficiaryId }) => beneficiaryId),
			},
			{ additionalTypenames: ['notebook_member'] }
		);
		if (updateResponse.error) {
			error = true;
			console.error(updateResponse.error);
			return;
		}
		if (onClose) onClose();
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
				selectLabel={member ? 'Nom du nouveau référent unique' : 'Nom du référent unique'}
				selectHint="Sélectionner un professionnel"
				options={professionalOptions}
				name="professional"
				id="professional"
			/>
			{#if showResetMembers}
				<Checkbox
					label="Retirer l'ancien référent du groupe de suivi."
					name="reset"
					bind:checked={resetMembers}
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
