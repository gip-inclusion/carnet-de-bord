<script lang="ts" context="module">
	import * as yup from 'yup';

	const validationSchema = yup.object().shape({
		orientationType: yup
			.mixed<OrientationTypeEnum>()
			.oneOf(Object.values(OrientationTypeEnum))
			.required(),
		structureId: yup.string().required().min(1),
		professionalAccountId: yup.string().nullable(),
	});
	export type OrientationValidationSchema = yup.InferType<typeof validationSchema>;
</script>

<script lang="ts">
	import {
		type GetOrientationTypeQuery,
		GetOrientationTypeDocument,
		GetStructuresWithProDocument,
		type GetStructuresWithProQuery,
		OrientationTypeEnum,
	} from '$lib/graphql/_gen/typed-document-nodes';
	import { query, operationStore, type OperationStore } from '@urql/svelte';
	import { Alert, Button } from '$lib/ui/base';
	import { Form, Select } from '$lib/ui/forms';
	import LoaderIndicator from '$lib/ui/utils/LoaderIndicator.svelte';
	import { openComponent } from '$lib/stores';
	import { displayFullName } from '../format';

	export let displayError = false;
	export let formTitle = 'Réorienter';
	export let handleSubmit: (values: OrientationValidationSchema) => Promise<void>;

	export let structureId: string = null;
	let selectedStructureId = structureId;

	let orientationTypes: OperationStore<GetOrientationTypeQuery> = operationStore(
		GetOrientationTypeDocument
	);
	query(orientationTypes);

	$: orientationOptions =
		$orientationTypes.data?.orientation_type.map(({ id, label }) => ({
			name: id,
			label,
		})) ?? [];

	let structures: OperationStore<GetStructuresWithProQuery> = operationStore(
		GetStructuresWithProDocument,
		null,
		{ requestPolicy: 'network-only' }
	);
	query(structures);
	$: structureOptions =
		$structures.data?.structure.map(({ id, name, professionals }) => {
			const beneficiaryCount = professionals.reduce(
				(total: number, value: GetStructuresWithProQuery['structure'][0]['professionals'][0]) => {
					return total + value.account.referentCount.aggregate.count;
				},
				0
			);
			return {
				name: id,
				label: `${name} (${beneficiaryCount})`,
			};
		}) ?? [];

	$: structure = $structures.data?.structure.find(({ id }) => id === selectedStructureId) ?? null;

	$: professionalOptions =
		structure?.professionals.map((pro) => ({
			name: pro.account.id,
			label: `${displayFullName(pro)} (${pro.account.referentCount.aggregate.count})`,
		})) ?? [];

	const initialValues = { structureId };

	function close() {
		openComponent.close();
	}
</script>

<section class="flex flex-col w-full">
	<h1>{formTitle}</h1>
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
				Veuillez sélectionner l'orientation ainsi que la nouvelle structure et le nouveau référent.
			</p>
			<Select
				required
				selectLabel="Type d'orientation"
				selectHint="Sélectionner un type d'orientation"
				options={orientationOptions}
				name="orientationType"
			/>
			{#if structureId === null}
				<Select
					required
					selectLabel="Nom de la structure"
					selectHint="Sélectionner une structure"
					additionalLabel="Le nombre affiché correspond au nombre de bénéficiaires actuellement pris en charge par la structure"
					options={structureOptions}
					name="structureId"
					on:select={(event) => {
						form.professionalAccountId = null;
						selectedStructureId = event.detail.selected;
					}}
				/>
			{/if}
			<Select
				selectLabel="Nom du référent unique"
				selectHint="Sélectionner un professionnel"
				additionalLabel="La sélection du professionnel n’est pas obligatoire. Le nombre affiché correspond au nombre de bénéficiaires pour lequel le professionnel est désigné référent"
				options={professionalOptions}
				name="professionalAccountId"
				disabled={!form.structureId}
			/>
			{#if displayError}
				<Alert type="error" size="sm">Impossible de modifier l'orientation</Alert>
			{/if}
			<div class="pt-4">
				<Button type="submit" disabled={(isSubmitted && !isValid) || isSubmitting}>Valider</Button>
				<Button outline on:click={close}>Annuler</Button>
			</div>
		</LoaderIndicator>
	</Form>
</section>