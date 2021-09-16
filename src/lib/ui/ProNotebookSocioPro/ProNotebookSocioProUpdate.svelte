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
	import { Checkbox2, Radio2, Select2 } from '../base';
	import Button from '../base/Button.svelte';
	import Input from '../base/Input.svelte';

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

	async function handleSubmit() {
		await updateSocioPro({
			id: notebook.id,
			...formData,
		});
		openComponent.close();
	}

	function onCancel() {
		openComponent.close();
	}
</script>

<section class="pl-4">
	<div class="pb-8">
		<h1>Informations personnelles</h1>
		<p class="mb-0">Veuillez cliquer sur un champ pour le modifier</p>
	</div>
	<form on:submit|preventDefault={handleSubmit}>
		<div class="fr-form-group">
			<Select2
				selectLabel={'Situation'}
				selectHint={"Ex : En recherche d'emploi"}
				options={workSituationKeys.options}
				bind:selected={formData.workSituation}
			/>
			<Input bind:val={formData.workSituationDate} inputLabel="Depuis le" type="date" />
		</div>
		<Radio2
			caption={'Revenu de solidarité active (RSA)'}
			bind:selected={formData.rightRsa}
			options={rsaRightKeys.options}
		/>

		<div class="fr-form-group">
			<div class="font-bold pb-2">Autres aides</div>
			<Checkbox2 bind:value={formData.rightAre} name="rightAre" label="ARE" />
			<Checkbox2 bind:value={formData.rightAss} name="rightAss" label="ASS" />
			<Checkbox2 bind:value={formData.rightRqth} name="rightRqth" label="RQTH" />
			<Checkbox2 bind:value={formData.rightBonus} name="rightBonus" label="Prime d'activité" />
		</div>

		<Radio2
			caption={'Zone géographique privilégiée'}
			bind:selected={formData.geographicalArea}
			options={geographicalAreaKeys.options}
		/>

		<div class="fr-form-group">
			<div class="font-bold pb-2">Diplôme</div>
			<Select2
				selectLabel={"Niveau d'étude le plus élevé"}
				options={educationLevelKeys.options}
				bind:selected={formData.educationLevel}
			/>
		</div>

		<div class="flex flex-row gap-2 pt-4 pb-12">
			<Button type="submit">Enregistrer</Button>
			<Button outline on:click={onCancel}>Annuler</Button>
		</div>
	</form>
</section>
