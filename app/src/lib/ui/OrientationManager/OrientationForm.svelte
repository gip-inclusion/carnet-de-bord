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
		type GetOrientationSystemsForDeploymentQuery,
		GetOrientationSystemsForDeploymentDocument,
		OrientationTypeEnum,
		type GetProfessionalsForDeploymentQuery,
		GetProfessionalsForDeploymentDocument,
		GetStructuresWithProDocument,
		type GetStructuresWithProQuery,
	} from '$lib/graphql/_gen/typed-document-nodes';
	import { query, operationStore, type OperationStore } from '@urql/svelte';
	import { Alert, Button } from '$lib/ui/base';
	import { Form, Select } from '$lib/ui/forms';
	import LoaderIndicator from '$lib/ui/utils/LoaderIndicator.svelte';
	import { connectedUser, openComponent } from '$lib/stores';
	import { displayFullName } from '../format';

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

	const orientationSystems: OperationStore<GetOrientationSystemsForDeploymentQuery> =
		operationStore(GetOrientationSystemsForDeploymentDocument, { deploymentId: deploymentId });
	query(orientationSystems);

	$: orientationSystemsOptions =
		$getProfessionals.data?.professional
			.flatMap(({ orientationSystems }) => {
				return orientationSystems.map(({ orientationSystem }) => {
					const formattedName = ['Pro', 'Social', 'Socio-pro'].includes(orientationSystem.name)
						? orientationSystem.name
						: `${orientationSystem.name} (${orientationSystem.orientationType})`;
					return {
						name: orientationSystem.id,
						label: formattedName,
					};
				});
			})
			.sort((a, b) => a.label.localeCompare(b.label))
			.filter((value, index, self) => index === self.findIndex((t) => t.name === value.name)) ?? [];

	const structures: OperationStore<GetStructuresWithProQuery> = operationStore(
		GetStructuresWithProDocument,
		null,
		{ requestPolicy: 'network-only' }
	);

	query(structures);

	$: structureOptions =
		$getProfessionals.data?.professional
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
			.filter((value, index, self) => index === self.findIndex((t) => t.name === value.name)) ?? [];

	$: professionalOptions =
		$getProfessionals.data?.professional.map((pro) => ({
			name: pro.account.id,
			label: `${displayFullName(pro)} (${pro.account.referentCount.aggregate.count})`,
		})) ?? [];

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
				{orientationSystemsOptions}
				{#each orientationSystemsOptions as orientationSystemsOption}
					{orientationSystemsOption.name} - {orientationSystemsOption.label}
				{/each}
			</p>
			<Select
				required
				selectLabel="Type d'orientation"
				selectHint="Sélectionner un type d'orientation"
				options={orientationSystemsOptions}
				name="orientationType"
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
