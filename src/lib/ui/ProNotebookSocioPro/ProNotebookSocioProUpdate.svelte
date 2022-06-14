<script lang="ts">
	import {
		educationLevelKeys,
		geographicalAreaKeys,
		rsaRightKeys,
		workSituationKeys,
	} from '$lib/constants/keys';
	import { Notebook, UpdateSocioProDocument } from '$lib/graphql/_gen/typed-document-nodes';
	import { openComponent } from '$lib/stores';
	import { trackEvent } from '$lib/tracking/matomo';
	import { mutation, operationStore } from '@urql/svelte';
	import { Button, Checkbox, Input, Radio, Select } from '../base';
	import ProNotebookSocioProRome from './ProNotebookSocioProROME.svelte';
	import { add } from 'date-fns';
	import { formatDateISO } from '$lib/utils/date';

	export let options: { id: string; label: string }[];
	export let notebook: Pick<
		Notebook,
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

	function initFormData(): typeof notebook {
		return {
			id: notebook.id,
			workSituation: notebook.workSituation,
			workSituationDate: notebook.workSituationDate,
			workSituationEndDate: notebook.workSituationEndDate,
			rightRsa: notebook.rightRsa,
			rightAre: notebook.rightAre,
			rightAss: notebook.rightAss,
			rightRqth: notebook.rightRqth,
			rightBonus: notebook.rightBonus,
			wantedJobs: notebook.wantedJobs,
			geographicalArea: notebook.geographicalArea,
			educationLevel: notebook.educationLevel,
		};
	}

	const formData = initFormData();

	function close() {
		openComponent.close();
	}

	async function handleSubmit() {
		trackEvent('pro', 'notebook', 'update socio pro info');
		sanitizeDates();
		await updateSocioPro({
			id: notebook.id,
			...formData,
			wantedJobs: formData.wantedJobs.map((rome_code_id) => ({
				notebook_id: notebook.id,
				rome_code_id,
			})),
		});
		close();
	}

	function sanitizeDates() {
		formData.workSituationDate =
			formData.workSituationDate === '' ? null : formData.workSituationDate;
		formData.workSituationEndDate =
			formData.workSituationEndDate === '' ? null : formData.workSituationEndDate;
	}

	function setWorkSitutationEndDate(monthInterval: number) {
		let newDate = null;
		if (monthInterval && formData.workSituationDate) {
			newDate = formatDateISO(add(new Date(formData.workSituationDate), { months: monthInterval }));
		}
		formData.workSituationEndDate = newDate;
	}

	function updateEndDate() {
		if (!formData.workSituationDate) {
			formData.workSituationEndDate = null;
		}
	}
</script>

<section class="flex flex-col w-full">
	<div class="pb-8">
		<h1>Situation socioprofessionnelle</h1>
		<p class="mb-0">Veuillez cliquer sur un champ pour le modifier.</p>
	</div>
	<form class="flex flex-col w-full" on:submit|preventDefault={handleSubmit}>
		<div class="fr-form-group">
			<Select
				selectLabel={'Situation actuelle'}
				selectHint={'Sélectionnez votre situation actuelle...'}
				options={workSituationKeys.options}
				bind:selected={formData.workSituation}
			/>
			<div class="row-auto">
				<div class="grid grid-cols-2 gap-4">
					<div>
						<Input
							class="mb-0"
							bind:value={formData.workSituationDate}
							on:change={updateEndDate}
							inputLabel="Depuis le"
							type="date"
						/>
					</div>
					<div class={`${formData.workSituationDate ? '' : 'invisible'}`}>
						<Input
							id="work-situation-end-date"
							class="mb-0"
							bind:value={formData.workSituationEndDate}
							inputLabel="Au"
							type="date"
							min={formData.workSituationDate}
							error={formData.workSituationEndDate &&
							formData.workSituationEndDate < formData.workSituationDate
								? 'La date de fin est antérieure à celle du début'
								: null}
						/>
						<div class="col-end-3 italic text-xs mt-1 text-france-blue-500">
							<span>Durée : </span>
							<button
								aria-controls="work-situation-end-date"
								aria-label="Définir la fin de la situation dans 3 mois"
								type="button"
								class="cursor-pointer underline"
								on:click={() => setWorkSitutationEndDate(3)}>3 mois</button
							>
							-
							<button
								aria-controls="work-situation-end-date"
								aria-label="Définir la fin de la situation dans 6 mois"
								type="button"
								class="cursor-pointer underline"
								on:click={() => setWorkSitutationEndDate(6)}>6 mois</button
							>
							-
							<button
								aria-controls="work-situation-end-date"
								aria-label="Définir la fin de la situation dans 12 mois"
								type="button"
								class="cursor-pointer underline"
								on:click={() => setWorkSitutationEndDate(12)}>12 mois</button
							>
							-
							<button
								aria-controls="work-situation-end-date"
								aria-label="Définir la durée comme étant indéterminée"
								type="button"
								class="cursor-pointer underline"
								on:click={() => setWorkSitutationEndDate(null)}>indéterminée</button
							>
						</div>
					</div>
				</div>
			</div>
		</div>
		<Radio
			caption={'Revenu de solidarité active (RSA)'}
			bind:selected={formData.rightRsa}
			options={rsaRightKeys.options}
		/>

		<div class="fr-form-group">
			<div class="pb-2 font-bold">Autres aides</div>
			<Checkbox bind:checked={formData.rightAre} name="rightAre" label="ARE" />
			<Checkbox bind:checked={formData.rightAss} name="rightAss" label="ASS" />
			<Checkbox bind:checked={formData.rightRqth} name="rightRqth" label="RQTH" />
			<Checkbox bind:checked={formData.rightBonus} name="rightBonus" label="Prime d'activité" />
		</div>

		<div class="fr-form-group">
			<div class="!pb-2 font-bold">
				<label for={romeSelectorId}>Emploi recherché</label>
			</div>
			<ProNotebookSocioProRome bind:value={formData.wantedJobs} {options} {romeSelectorId} />
		</div>

		<Radio
			caption={'Zone de mobilité'}
			legendClass="!font-bold"
			bind:selected={formData.geographicalArea}
			options={geographicalAreaKeys.options}
		/>

		<div class="fr-form-group">
			<div class="pb-2 font-bold">Niveau de formation</div>
			<Select
				selectLabel={"Niveau d'étude le plus élevé"}
				options={educationLevelKeys.options}
				bind:selected={formData.educationLevel}
			/>
		</div>

		<div class="flex flex-row gap-6 pt-4 pb-12">
			<Button type="submit">Enregistrer</Button>
			<Button outline on:click={close}>Annuler</Button>
		</div>
	</form>
</section>
