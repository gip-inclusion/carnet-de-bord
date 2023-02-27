<script lang="ts">
	import { educationLevelKeys, workSituationKeys } from '$lib/constants/keys';
	import type { GetNotebookQuery } from '$lib/graphql/_gen/typed-document-nodes';
	import { UpdateSocioProDocument } from '$lib/graphql/_gen/typed-document-nodes';
	import { trackEvent } from '$lib/tracking/matomo';
	import { mutation, operationStore } from '@urql/svelte';
	import { Button } from '../base';
	import { add } from 'date-fns';
	import { formatDateISO } from '$lib/utils/date';
	import {
		type ProNotebookSocioproInput,
		proNotebookSocioproSchema,
	} from './ProNotebookSocioPro.schema';
	import { Checkbox, Form, Input, Select } from '$lib/ui/forms';
	import { captureException } from '$lib/utils/sentry';

	export let onClose: () => void;
	export let notebook: Pick<
		GetNotebookQuery['notebook_public_view'][0]['notebook'],
		| 'id'
		| 'workSituation'
		| 'workSituationDate'
		| 'workSituationEndDate'
		| 'rightRqth'
		| 'educationLevel'
		| 'lastJobEndedAt'
		| 'focuses'
		| 'situations'
	> & { professionalProjects: string[] };
	export let selectedSituations: string[];

	const updateSocioProStore = operationStore(UpdateSocioProDocument);
	const updateSocioPro = mutation(updateSocioProStore);

	const initialValues = {
		workSituation: notebook.workSituation,
		workSituationDate: notebook.workSituationDate ?? '',
		workSituationEndDate: notebook.workSituationEndDate ?? '',
		rightRqth: notebook.rightRqth,
		educationLevel: notebook.educationLevel,
		lastJobEndedAt: notebook.lastJobEndedAt ?? '',
	};

	const professionalProjects = notebook.professionalProjects;

	function close() {
		onClose();
	}

	async function handleSubmit(values: ProNotebookSocioproInput) {
		trackEvent('pro', 'notebook', 'update socio pro info');
		const { educationLevel, rightRqth, workSituation } =
			proNotebookSocioproSchema.validateSync(values);

		const currentSituationIds = notebook.situations.map(({ refSituation }) => refSituation.id);

		const situationsToAdd = selectedSituations
			.filter((id) => !currentSituationIds.includes(id))
			.map((situationId) => {
				return {
					notebookId: notebook.id,
					situationId,
				};
			});

		const situationIdsToDelete = currentSituationIds.filter(
			(id) => !selectedSituations.includes(id)
		);

		const payload = {
			id: notebook.id,
			educationLevel,
			rightRqth,
			workSituation,
			workSituationDate: values.workSituationDate.toString() || null,
			workSituationEndDate: values.workSituationEndDate.toString() || null,
			lastJobEndedAt: values.lastJobEndedAt.toString() || null,
			professionalProjects: professionalProjects.map((rome_code_id) => ({
				notebook_id: notebook.id,
				rome_code_id,
				mobilityRadius: 0,
			})),
			situationsToAdd,
			situationIdsToDelete,
		};

		await updateSocioPro(payload);
		close();
	}

	function setWorkSituationEndDate(initialDate: unknown, monthInterval: number) {
		if (
			typeof initialDate !== 'string' &&
			typeof initialDate !== 'number' &&
			!(initialDate instanceof Date)
		) {
			captureException(
				new Error(
					`[setWorkSituationEndDate] Une date était attendue mais la sélection reçue est ${JSON.stringify(
						initialDate
					)}.`
				)
			);
			return initialDate;
		}
		if (monthInterval) {
			return formatDateISO(add(new Date(initialDate), { months: monthInterval }));
		}
		return initialDate;
	}
</script>

<section class="flex flex-col w-full">
	<div class="pb-8">
		<h1 class="text-france-blue">Diagnostic socioprofessionnel</h1>
		<p class="mb-0">Veuillez cliquer sur un champ pour le modifier.</p>
	</div>
	<Form
		{initialValues}
		validationSchema={proNotebookSocioproSchema}
		onSubmit={handleSubmit}
		let:form
		let:updateValidateField
		let:isSubmitted
		let:isSubmitting
		let:isValid
	>
		<h2 class="text-france-blue">Situation professionnelle</h2>
		<div class="fr-form-group">
			<Select
				name="workSituation"
				selectLabel={'Situation actuelle'}
				selectHint={'Sélectionnez votre situation actuelle...'}
				options={workSituationKeys.options}
			/>
			<div class="row-auto">
				<div class="grid grid-cols-2 gap-4">
					<div>
						<Input class="mb-0" name="workSituationDate" inputLabel="Depuis le" type="date" />
					</div>
					<div>
						<Input
							id="work-situation-end-date"
							class="mb-0"
							name="workSituationEndDate"
							inputLabel="Jusqu'au"
							type="date"
						/>
						<div class="col-end-3 italic text-xs mt-1 text-france-blue-500">
							<span>Durée : </span>
							<button
								aria-controls="work-situation-end-date"
								aria-label="Définir la fin de la situation dans 3 mois"
								type="button"
								class="cursor-pointer underline"
								on:click={() => {
									updateValidateField(
										'workSituationEndDate',
										setWorkSituationEndDate(form.workSituationDate, 3)
									);
								}}>3 mois</button
							>
							-
							<button
								aria-controls="work-situation-end-date"
								aria-label="Définir la fin de la situation dans 6 mois"
								type="button"
								class="cursor-pointer underline"
								on:click={() => {
									updateValidateField(
										'workSituationEndDate',
										setWorkSituationEndDate(form.workSituationDate, 6)
									);
								}}>6 mois</button
							>
							-
							<button
								aria-controls="work-situation-end-date"
								aria-label="Définir la fin de la situation dans 12 mois"
								type="button"
								class="cursor-pointer underline"
								on:click={() => {
									updateValidateField(
										'workSituationEndDate',
										setWorkSituationEndDate(form.workSituationDate, 12)
									);
								}}>12 mois</button
							>
							-
							<button
								aria-controls="work-situation-end-date"
								aria-label="Définir la fin de la situation dans 24 mois"
								type="button"
								class="cursor-pointer underline"
								on:click={() => {
									updateValidateField(
										'workSituationEndDate',
										setWorkSituationEndDate(form.workSituationDate, 24)
									);
								}}>24 mois</button
							>
							-
							<button
								aria-controls="work-situation-end-date"
								aria-label="Définir la durée comme étant indéterminée"
								type="button"
								class="cursor-pointer underline"
								on:click={() => {
									updateValidateField('workSituationEndDate', '');
								}}>indéterminée</button
							>
						</div>
					</div>
				</div>
			</div>
		</div>
		<div class="fr-form-group">
			<Input name="lastJobEndedAt" inputLabel="Date de fin du dernier emploi" type="date" />
		</div>
		<div class="pb-4">
			<Checkbox name="rightRqth" label="RQTH" />
		</div>

		<Input name="geographicalArea" inputLabel="Zone de mobilité géographique (km)" type="number" />

		<div class="fr-form-group">
			<div class="pb-2 font-bold">Niveau de formation</div>
			<Select
				name="educationLevel"
				selectLabel={"Niveau d'étude le plus élevé"}
				options={educationLevelKeys.options}
			/>
		</div>

		<slot />

		<div class="flex flex-row gap-6 pt-4 pb-12">
			<Button type="submit" disabled={isSubmitting || (isSubmitted && !isValid)}>Enregistrer</Button
			>
			<Button outline on:click={close}>Annuler</Button>
		</div>
	</Form>
</section>
