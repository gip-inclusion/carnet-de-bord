<script lang="ts">
	import {
		type GetNotebookByBeneficiaryIdQuery,
		type GetOrientationTypeQuery,
		GetOrientationTypeDocument,
		GetStructuresDocument,
		type GetStructuresQuery,
		type GetProfessionalsFromStructuresQuery,
		GetProfessionalsFromStructuresDocument,
	} from '$lib/graphql/_gen/typed-document-nodes';
	import { query, operationStore, type OperationStore } from '@urql/svelte';
	import { Select } from '../base';
	import Button from '../base/Button.svelte';
	import { openComponent } from '$lib/stores';
	import Alert from '../base/Alert.svelte';
	import { displayFullName } from '../format';

	export let orientationRequest: GetNotebookByBeneficiaryIdQuery['notebook'][0]['beneficiary']['orientationRequest'][0];

	let selectedProfessional: string = null;
	let selectedOrientationType: string = null;
	let selectedStructure = null;
	let error = false;

	let orientationTypeStore: OperationStore<GetOrientationTypeQuery> = operationStore(
		GetOrientationTypeDocument
	);
	query(orientationTypeStore);

	$: orientationOptions =
		$orientationTypeStore.data?.orientation_type.map(({ id, label }) => ({
			name: id,
			label,
		})) ?? [];

	let structureStore: OperationStore<GetStructuresQuery> = operationStore(GetStructuresDocument);
	query(structureStore);
	$: structureOptions =
		$structureStore.data?.structure.map(({ id, name }) => ({
			name: id,
			label: name,
		})) ?? [];

	$: professionalOptions = (() => {
		selectedProfessional = null;
		let professionalsStore: OperationStore<GetProfessionalsFromStructuresQuery> = operationStore(
			GetProfessionalsFromStructuresDocument,
			{ id: selectedStructure }
		);

		query(professionalsStore);

		return (
			professionalsStore.data?.professional.map((pro) => ({
				name: pro.id,
				label: displayFullName(pro),
			})) ?? []
		);
	})();

	async function handleSubmit() {
		console.log(`Acceptation de la demande ${orientationRequest}`);
		error = true;
	}

	function close() {
		openComponent.close();
	}
</script>

<section class="flex flex-col w-full">
	<h1>Réorientation des bénéficiaires</h1>
	<form on:submit|preventDefault={handleSubmit}>
		<p>
			Veuillez sélectionner l'orientation ansi que la nouvelle structure et le nouveau référent.
		</p>
		<Select
			bind:selected={selectedOrientationType}
			selectLabel="Orientation"
			selectHint="Sélectionner..."
			options={orientationOptions}
			name="orientationType"
			id="orientationType"
		/>
		<Select
			bind:selected={selectedStructure}
			selectLabel="Structure d‘accompagnement"
			selectHint="Sélectionner..."
			options={structureOptions}
			name="structure"
			id="structure"
		/>
		<Select
			bind:selected={selectedProfessional}
			selectLabel="Référent unique"
			selectHint="Sélectionner..."
			options={professionalOptions}
			name="professional"
			id="professional"
		/>
		{#if error}
			<Alert type="error" size="sm">Impossible de modifier l'orientation</Alert>
		{/if}
		<div class="flex flex-row gap-6 mt-12">
			<Button type="submit">Valider</Button>
			<Button outline on:click={close}>Annuler</Button>
		</div>
	</form>
</section>
