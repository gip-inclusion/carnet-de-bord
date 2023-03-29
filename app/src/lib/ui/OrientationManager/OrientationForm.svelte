<script lang="ts" context="module">
	import * as yup from 'yup';

	const validationSchema = yup.object().shape({
		orientationSystemId: yup.string().required(),
		structureId: yup.string().uuid().required().min(1),
		professionalAccountId: yup.string().nullable(),
		orientationReason: yup.string().nullable(),
	});
	export type OrientationValidationSchema = yup.InferType<typeof validationSchema>;
</script>

<script lang="ts">
	import {
		type GetOrientationSystemsForDeploymentQuery,
		GetOrientationSystemsForDeploymentDocument,
	} from '$lib/graphql/_gen/typed-document-nodes';
	import { query, operationStore, type OperationStore } from '@urql/svelte';
	import { Alert, Button } from '$lib/ui/base';
	import { Form, Select, Input } from '$lib/ui/forms';
	import LoaderIndicator from '$lib/ui/utils/LoaderIndicator.svelte';
	import { openComponent } from '$lib/stores';
	import { displayFullName } from '../format';
	import { getOrientationSystemLabel } from '$lib/utils/getOrientationSystemLabel';

	export let displayError = false;
	export let formTitle = 'Réorienter';
	export let handleSubmit: (values: OrientationValidationSchema) => Promise<void>;

	export let structureId: string = null;
	let selectedStructureId = structureId;
	let selectedOrientationSystemId: string = null;

	const getOrientationSystems: OperationStore<GetOrientationSystemsForDeploymentQuery> =
		operationStore(GetOrientationSystemsForDeploymentDocument);

	query(getOrientationSystems);

	$: orientationSystemsOptions =
		$getOrientationSystems.data?.orientation_system.map((orientationSystem) => {
			return {
				name: orientationSystem.id,
				label: getOrientationSystemLabel(orientationSystem),
			};
		}) ?? [];

	$: structureOptions =
		$getOrientationSystems.data?.orientation_system
			.find((orientation_system) => orientation_system.id == selectedOrientationSystemId)
			?.structureOrientationSystems.map(({ structure }) => {
				const beneficiaryCount = structure.professionals.reduce(
					(
						total: number,
						value: GetOrientationSystemsForDeploymentQuery['orientation_system'][number]['structureOrientationSystems'][number]['structure']['professionals'][number]
					) => {
						return total + value.account.referentCount.aggregate.count;
					},
					0
				);
				return {
					name: structure.id,
					label: `${structure.name} (${beneficiaryCount})`,
				};
			}) ?? [];

	$: professionalOptions =
		$getOrientationSystems.data?.orientation_system
			.find((orientation_system) => orientation_system.id == selectedOrientationSystemId)
			?.structureOrientationSystems.find(({ structure }) => structure.id == selectedStructureId)
			?.structure.professionals.filter((pro) => {
				return pro.orientationSystems.some(
					({ orientationSystem }) => orientationSystem.id === selectedOrientationSystemId
				);
			})
			.map((pro) => ({
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
		<LoaderIndicator result={getOrientationSystems}>
			<p>
				Veuillez sélectionner le dispositif d'accompagnement ainsi que la nouvelle structure et le
				nouveau référent.
			</p>
			<Select
				required
				selectLabel="Dispositif d'accompagnement"
				selectHint={orientationSystemsOptions.length === 0
					? "Pas de dispositif d'accompagnement disponible"
					: "Sélectionner un dispositif d'accompagnement"}
				disabled={orientationSystemsOptions.length === 0}
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
					selectHint={structureOptions.length === 0
						? 'Pas de structure disponible'
						: 'Sélectionner une structure'}
					disabled={structureOptions.length === 0}
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
				selectHint={professionalOptions.length === 0
					? 'Pas de professionnel disponible'
					: 'Sélectionner un professionnel'}
				additionalLabel="La sélection du professionnel n’est pas obligatoire. Le nombre affiché correspond au nombre de bénéficiaires pour lequel le professionnel est désigné référent"
				options={professionalOptions}
				name="professionalAccountId"
				disabled={!form.structureId || professionalOptions.length === 0}
			/>
			<Input
				name="orientationReason"
				placeholder="Saisir le motif de l’orientation"
				inputHint="Le motif de l’orientation sera disponible pour la personne désignée référente unique."
				inputLabel="Motif de l’orientation"
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
