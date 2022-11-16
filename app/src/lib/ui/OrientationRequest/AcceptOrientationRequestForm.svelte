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
	import * as yup from 'yup';
	import { query, operationStore, type OperationStore } from '@urql/svelte';
	import { Alert, Button } from '$lib/ui/base';
	import { Form, Select } from '$lib/ui/forms';
	import LoaderIndicator from '$lib/ui/utils/LoaderIndicator.svelte';
	import { openComponent } from '$lib/stores';
	import { displayFullName } from '../format';

	export let orientationRequest: GetNotebookByBeneficiaryIdQuery['notebook'][0]['beneficiary']['orientationRequest'][0];

	let selectedStructureId: string = null;
	let error = false;

	let orientationTypes: OperationStore<GetOrientationTypeQuery> = operationStore(
		GetOrientationTypeDocument
	);
	query(orientationTypes);

	$: orientationOptions =
		$orientationTypes.data?.orientation_type.map(({ id, label }) => ({
			name: id,
			label,
		})) ?? [];

	let structures: OperationStore<GetStructuresQuery> = operationStore(GetStructuresDocument);
	query(structures);
	$: structureOptions =
		$structures.data?.structure.map(({ id, name }) => ({
			name: id,
			label: name,
		})) ?? [];

	$: professionalOptions = (() => {
		let professionalsStore: OperationStore<GetProfessionalsFromStructuresQuery> = operationStore(
			GetProfessionalsFromStructuresDocument,
			{ id: selectedStructureId }
		);

		query(professionalsStore);

		return (
			professionalsStore.data?.professional.map((pro) => ({
				name: pro.account.id,
				label: displayFullName(pro),
			})) ?? []
		);
	})();

	const validationSchema = yup.object().shape({
		orientationType: yup.string().required().min(1),
		structureId: yup.string().required().min(1),
		professionalAccountId: yup.string().nullable(),
	});

	const initialValues = {};

	async function handleSubmit(values: yup.InferType<typeof validationSchema>) {
		console.log(`Acceptation de la demande ${orientationRequest}, ${JSON.stringify(values)}`);
		error = true;
	}

	function close() {
		openComponent.close();
	}
</script>

<section class="flex flex-col w-full">
	<h1>Réorientation des bénéficiaires</h1>
	<Form
		onSubmit={handleSubmit}
		{initialValues}
		{validationSchema}
		let:isSubmitting
		let:isSubmitted
		let:isValid
		let:form
	>
		<LoaderIndicator result={structures}>
			<p>
				Veuillez sélectionner l'orientation ansi que la nouvelle structure et le nouveau référent.
			</p>
			<Select
				required
				selectLabel="Type d'orientation"
				selectHint="Sélectionner un type d'orientation"
				options={orientationOptions}
				name="orientationType"
			/>
			<Select
				required
				selectLabel="Nom de la structure"
				selectHint="Sélectionner une structure"
				options={structureOptions}
				name="structureId"
				on:select={() => {
					// FIXME: on:select is never called
					form.professionalAccountId = null;
					console.log(form.structureId);
					selectedStructureId = String(form.structureId);
				}}
			/>
			<Select
				selectLabel="Nom du référent unique"
				selectHint="Sélectionner un professionnel"
				additionalLabel="La sélection du professionnel n’est pas obligatoire."
				options={professionalOptions}
				name="professionalAccountId"
				disabled={!form.selectedStructureId}
			/>
			{#if error}
				<Alert type="error" size="sm">Impossible de modifier l'orientation</Alert>
			{/if}
			<div class="pt-4">
				<Button type="submit" disabled={(isSubmitted && !isValid) || isSubmitting}>Valider</Button>
				<Button outline on:click={close}>Annuler</Button>
			</div>
		</LoaderIndicator>
	</Form>
</section>
