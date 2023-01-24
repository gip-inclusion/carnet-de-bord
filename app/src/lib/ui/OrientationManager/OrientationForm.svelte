<script lang="ts" context="module">
	import * as yup from 'yup';

	const validationSchema = yup.object().shape({
		orientationSystemId: yup.string().required(),
		structureId: yup.string().required().min(1),
		professionalAccountId: yup.string().nullable(),
	});
	export type OrientationValidationSchema = yup.InferType<typeof validationSchema>;
</script>

<script lang="ts">
	import {
		type GetProfessionalsForDeploymentQuery,
		GetProfessionalsForDeploymentDocument,
	} from '$lib/graphql/_gen/typed-document-nodes';
	import { query, operationStore, type OperationStore } from '@urql/svelte';
	import { Alert, Button } from '$lib/ui/base';
	import { Form, Select } from '$lib/ui/forms';
	import LoaderIndicator from '$lib/ui/utils/LoaderIndicator.svelte';
	import { connectedUser, openComponent } from '$lib/stores';
	import { displayFullName } from '../format';
	import { getOrientationSystemLabel } from '$lib/utils/getOrientationSystemLabel';

	export let displayError = false;
	export let formTitle = 'Réorienter';
	export let handleSubmit: (values: OrientationValidationSchema) => Promise<void>;

	export let structureId: string = null;
	let selectedStructureId = structureId;
	let selectedOrientationSystemId: string = null;

	const deploymentId = $connectedUser.deploymentId;

	const getProfessionals: OperationStore<GetProfessionalsForDeploymentQuery> = operationStore(
		GetProfessionalsForDeploymentDocument,
		{
			deploymentId: deploymentId,
		}
	);

	query(getProfessionals);

	$: orientationSystemsOptions =
		$getProfessionals.data?.professional
			.flatMap(({ orientationSystems }) => {
				return orientationSystems.map(({ orientationSystem }) => {
					return {
						name: orientationSystem.id,
						label: getOrientationSystemLabel(orientationSystem),
					};
				});
			})
			// Sort by alphabetical order
			.sort((a, b) => a.label.localeCompare(b.label))
			// Get unique values
			.filter((value, index, self) => index === self.findIndex((t) => t.name === value.name)) ?? [];

	$: structureOptions =
		$getProfessionals.data?.professional
			// Get professionnals that have the selected orientation system attached
			.filter(({ orientationSystems }) =>
				orientationSystems
					.map(({ orientationSystemId }) => orientationSystemId)
					.includes(selectedOrientationSystemId)
			)
			// Get the structures of this professional
			.map(({ structure }) => {
				const beneficiaryCount = structure.professionals.reduce(
					(
						total: number,
						value: GetProfessionalsForDeploymentQuery['professional'][0]['structure']['professionals'][0]
					) => {
						return total + value.account.referentCount.aggregate.count;
					},
					0
				);
				return {
					name: structure.id,
					label: `${structure.name} (${beneficiaryCount})`,
				};
			})
			// Sort by alphabetical order
			.sort((a, b) => a.label.localeCompare(b.label))
			.filter((value, index, self) => index === self.findIndex((t) => t.name === value.name)) ?? [];

	$: professionalOptions =
		$getProfessionals.data?.professional
			// Get professionals corresponding to the selected structures
			.filter(({ structure }) => structure.id == selectedStructureId)
			//Get professionnals that have the selected orientation system attached
			.filter(({ orientationSystems }) =>
				orientationSystems
					.map(({ orientationSystemId }) => orientationSystemId)
					.includes(selectedOrientationSystemId)
			)
			.map((pro) => ({
				name: pro.account.id,
				label: `${displayFullName(pro)} (${pro.account.referentCount.aggregate.count})`,
			}))
			// Sort by alphabetical order
			.sort((a, b) => a.label.localeCompare(b.label)) ?? [];

	const initialValues = { structureId };

	function orientationSystemSelected(event: CustomEvent<{ selected: string }>) {
		selectedOrientationSystemId = event.detail.selected;
		selectedStructureId = null;
	}

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
		<LoaderIndicator result={getProfessionals}>
			<p>
				Veuillez sélectionner l'orientation ainsi que la nouvelle structure et le nouveau référent.
			</p>
			<Select
				required
				selectLabel="Type d'orientation"
				selectHint="Sélectionner un type d'orientation"
				options={orientationSystemsOptions}
				name="orientationSystemId"
				on:select={(event) => {
					orientationSystemSelected(event);
					form.professionalAccountId = null;
					form.structureId = null;
				}}
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
