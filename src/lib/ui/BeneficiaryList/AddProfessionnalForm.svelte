<script lang="ts">
	import {
		GetBeneficiariesQuery,
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

	export let member: OperationStore<GetBeneficiariesQuery>['data']['beneficiaries'][0]['notebook']['members'][0];
	export let notebookId: string;
	export let structuresId: string[] = [];

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

	let selectedMember = member ? member.professional.id : null;
	let resetMembers: boolean;
	let error = false;

	async function handleSubmit() {
		console.log('submit', { member, selectedMember, resetMembers });
		if (resetMembers) {
			const deleteResponse = await deleteReferent({ notebook: notebookId });
			if (deleteResponse.error) {
				error = true;
				console.log(deleteResponse.error);
				return;
			}
		}
		const updateResponse = await updateReferent({
			notebook: notebookId,
			referent: selectedMember,
		});
		if (updateResponse.error) {
			error = true;
			console.log(updateResponse.error);
			return;
		}
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
		{#if member}
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
