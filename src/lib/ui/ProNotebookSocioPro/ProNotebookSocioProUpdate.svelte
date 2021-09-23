<script context="module" lang="ts">
</script>

<script lang="ts">
	import {
		educationLevelKeys,
		geographicalAreaKeys,
		rsaRightKeys,
		workSituationKeys,
	} from '$lib/constants/keys';
	import { Notebook, UpdateSocioProDocument } from '$lib/graphql/_gen/typed-document-nodes';
	import { openComponent } from '$lib/stores';
	import { mutation, operationStore } from '@urql/svelte';
	import { Button, Checkbox, Input, Radio, Select } from '../base';
	import ProNotebookSocioProRome from './ProNotebookSocioProROME.svelte';

	export let notebook: Pick<
		Notebook,
		| 'id'
		| 'workSituation'
		| 'workSituationDate'
		| 'rightRsa'
		| 'rightAre'
		| 'rightAss'
		| 'rightBonus'
		| 'rightRqth'
		| 'educationLevel'
		| 'geographicalArea'
		| 'job'
	>;

	const updateSocioProStore = operationStore(UpdateSocioProDocument);
	const updateSocioPro = mutation(updateSocioProStore);

	function initFormData(): typeof notebook {
		return {
			id: notebook.id,
			workSituation: notebook.workSituation,
			workSituationDate: notebook.workSituationDate,
			rightRsa: notebook.rightRsa,
			rightAre: notebook.rightAre,
			rightAss: notebook.rightAss,
			rightRqth: notebook.rightRqth,
			rightBonus: notebook.rightBonus,
			job: notebook.job,
			geographicalArea: notebook.geographicalArea,
			educationLevel: notebook.educationLevel,
		};
	}

	const formData = initFormData();

	function close() {
		openComponent.close();
	}

	async function handleSubmit() {
		await updateSocioPro({
			id: notebook.id,
			...formData,
		});
		close();
	}
</script>

<section class="pl-4">
	<div class="pb-8">
		<h1>Informations personnelles</h1>
		<p class="mb-0">Veuillez cliquer sur un champ pour le modifier</p>
	</div>
	<form on:submit|preventDefault={handleSubmit}>
		<div class="fr-form-group">
			<Select
				selectLabel={'Situation'}
				selectHint={'Sélectionner votre situation...'}
				options={workSituationKeys.options}
				bind:selected={formData.workSituation}
			/>
			<Input bind:val={formData.workSituationDate} inputLabel="Depuis le" type="date" />
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

		<Radio
			caption={'Zone géographique privilégiée'}
			legendClass="!font-bold"
			bind:selected={formData.geographicalArea}
			options={geographicalAreaKeys.options}
		/>

		<div class="fr-form-group">
			<div class="pb-2 font-bold">Emploi recherché</div>
			<ProNotebookSocioProRome bind:current={formData.job} />
		</div>

		<div class="fr-form-group">
			<div class="pb-2 font-bold">Diplôme</div>
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
