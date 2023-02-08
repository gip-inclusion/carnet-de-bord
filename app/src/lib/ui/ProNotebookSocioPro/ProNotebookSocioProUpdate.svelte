<script lang="ts">
	import {
		educationLevelKeys,
		geographicalAreaKeys,
		rsaRightKeys,
		workSituationKeys,
	} from '$lib/constants/keys';
	import type { GetNotebookQuery } from '$lib/graphql/_gen/typed-document-nodes';
	import { UpdateSocioProDocument } from '$lib/graphql/_gen/typed-document-nodes';
	import { openComponent } from '$lib/stores';
	import { trackEvent } from '$lib/tracking/matomo';
	import { mutation, operationStore } from '@urql/svelte';
	import { Button } from '../base';
	import ProNotebookSocioProRome from './ProNotebookSocioProROME.svelte';
	import { add } from 'date-fns';
	import { formatDateISO } from '$lib/utils/date';
	import {
		type ProNotebookSocioproInput,
		proNotebookSocioproSchema,
	} from './ProNotebookSocioPro.schema';
	import { Checkbox, Form, Input, Radio, Select } from '$lib/ui/forms';

	export let options: { id: string; label: string }[];
	export let notebook: Pick<
		GetNotebookQuery['notebook_public_view'][0]['notebook'],
		| 'id'
		| 'workSituation'
		| 'workSituationDate'
		| 'workSituationEndDate'
		| 'rightRsa'
		| 'rightAre'
		| 'rightAss'
		| 'rightBonus'
		| 'rightRqth'
		| 'educationLevel'
		| 'geographicalArea'
	> & { wantedJobs: string[] };

	const updateSocioProStore = operationStore(UpdateSocioProDocument);
	const updateSocioPro = mutation(updateSocioProStore);
	const romeSelectorId = 'romeSelectorId';

	const initialValues = {
		workSituation: notebook.workSituation,
		workSituationDate: notebook.workSituationDate ?? '',
		workSituationEndDate: notebook.workSituationEndDate ?? '',
		rightRsa: notebook.rightRsa,
		rightAre: notebook.rightAre,
		rightAss: notebook.rightAss,
		rightRqth: notebook.rightRqth,
		rightBonus: notebook.rightBonus,
		geographicalArea: notebook.geographicalArea,
		educationLevel: notebook.educationLevel,
	};

	let wantedJobs = notebook.wantedJobs;

	function close() {
		openComponent.close();
	}

	async function handleSubmit(values: ProNotebookSocioproInput) {
		trackEvent('pro', 'notebook', 'update socio pro info');
		const {
			educationLevel,
			geographicalArea,
			rightAre,
			rightAss,
			rightBonus,
			rightRqth,
			rightRsa,
			workSituation,
		} = values;

		const payload = {
			id: notebook.id,
			educationLevel,
			geographicalArea,
			rightAre,
			rightAss,
			rightBonus,
			rightRqth,
			rightRsa,
			workSituation,
			workSituationDate: values.workSituationDate.toString() || null,
			workSituationEndDate: values.workSituationEndDate.toString() || null,
			wantedJobs: wantedJobs.map((rome_code_id) => ({
				notebook_id: notebook.id,
				rome_code_id,
			})),
		};

		await updateSocioPro(payload);
		close();
	}

	function setWorkSituationEndDate(initialDate, monthInterval: number) {
		if (monthInterval) {
			return formatDateISO(add(new Date(initialDate), { months: monthInterval }));
		}
		return initialDate;
	}
</script>

<section class="flex flex-col w-full">
	<div class="pb-8">
		<h1>Diagnostic socioprofessionnel</h1>
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

		<div class="pb-4">
			<Checkbox name="rightRqth" label="RQTH" />
		</div>

		<Radio
			legend="Revenu de solidarité active (RSA)"
			name="rightRsa"
			options={rsaRightKeys.options}
		/>

		<div class="fr-form-group">
			<div class="pb-2 font-bold">Autres aides</div>
			<Checkbox name="rightAre" label="ARE" />
			<Checkbox name="rightAss" label="ASS" />
			<Checkbox name="rightBonus" label="Prime d'activité" />
		</div>

		<div class="fr-form-group">
			<div class="!pb-2 font-bold">
				<label for={romeSelectorId}>Emploi recherché</label>
			</div>
			<ProNotebookSocioProRome bind:value={wantedJobs} {options} {romeSelectorId} />
		</div>

		<Radio
			legend="Zone de mobilité"
			legendClass="!font-bold"
			name="geographicalArea"
			options={geographicalAreaKeys.options}
		/>

		<div class="fr-form-group">
			<div class="pb-2 font-bold">Niveau de formation</div>
			<Select
				name="educationLevel"
				selectLabel={"Niveau d'étude le plus élevé"}
				options={educationLevelKeys.options}
			/>
		</div>

		<div class="flex flex-row gap-6 pt-4 pb-12">
			<Button type="submit" disabled={isSubmitting || (isSubmitted && !isValid)}>Enregistrer</Button
			>
			<Button outline on:click={close}>Annuler</Button>
		</div>
	</Form>
</section>
