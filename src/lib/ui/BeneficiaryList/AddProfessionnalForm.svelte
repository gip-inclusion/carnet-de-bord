<script lang="ts">
	import {
		GetProfessionalsFromStructuresDocument,
		GetProfessionalsFromStructuresQuery,
		RemoveReferentDocument,
		UpdateReferentDocument,
	} from '$lib/graphql/_gen/typed-document-nodes';
	import { Checkbox, Select } from '../base';
	import { displayFullName } from '../format';
	import { operationStore, mutation, query } from '@urql/svelte';
	import type { OperationStore } from '@urql/svelte';
	import Button from '../base/Button.svelte';
	import { openComponent } from '$lib/stores';
	import Alert from '../base/Alert.svelte';

	export let member: string = null;
	export let notebooks: { beneficiaryId: string; notebookId: string }[];
	export let structuresId: string[] = [];
	export let showResetMembers = false;
	export let onClose: () => void;

	let professionalStore: OperationStore<GetProfessionalsFromStructuresQuery> = operationStore(
		GetProfessionalsFromStructuresDocument,
		{ structures: structuresId }
	);
	query(professionalStore);

	$: professionalOptions =
		$professionalStore.data?.professional.map((pro) => ({
			name: pro.id,
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
				console.log(deleteResponse.error);
				return;
			}
		}

		const updateResponse = await updateReferent(
			{
				objects: notebooks.map(({ notebookId }) => ({
					notebookId,
					memberType: 'referent',
					professionalId: selectedMember,
					active: true,
				})),
				structureId: professionalStore.data.professional.find(({ id }) => id === selectedMember)
					?.structure.id,
				beneficiaries: notebooks.map(({ beneficiaryId }) => beneficiaryId),
			},
			{ additionalTypenames: ['notebook_member'] }
		);
		if (updateResponse.error) {
			error = true;
			console.log(updateResponse.error);
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
	<div class="pb-8">
		<h1>Rattacher des bénéficiaires</h1>
		<p class="mb-0">Veuillez sélectionner le professionnel à rattacher aux bénéficiaires.</p>
	</div>
	<form on:submit|preventDefault={handleSubmit}>
		<Select
			bind:selected={selectedMember}
			selectLabel={member ? 'Nom du nouveau professionnel' : 'Nom du référent'}
			selectHint="Sélectionner un professionel"
			options={professionalOptions}
			name="professional"
			id="professional"
		/>
		{#if showResetMembers}
			<Checkbox
				label="Retirer les anciens accompagnateurs du groupe de suivi."
				name="reset"
				bind:checked={resetMembers}
			/>
		{/if}
		{#if error}
			<Alert type="error" size="sm">Impossible de modifier le rattachement</Alert>
		{/if}
		<div>
			<Button type="submit">Rattacher</Button>
			<Button outline on:click={close}>Annuler</Button>
		</div>
	</form>
</section>
