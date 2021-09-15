<script context="module" lang="ts">
</script>

<script lang="ts">
	import {
		educationLevelKeys,
		geographicalAreaKeys,
		rsaRightKeys,
		workSituationKeys
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
			educationLevel: notebook.educationLevel
		};
	}

	const formData = initFormData();

	async function handleSubmit() {
		await updateSocioPro({
			id: notebook.id,
			...formData
		});
		openComponent.close();
	}
</script>

<div>
	<form on:submit|preventDefault={handleSubmit}>
		<Select2
			selectLabel={'Situation'}
			selectHint={"Ex : En recherche d'emploi"}
			options={workSituationKeys.options}
			bind:selected={formData.workSituation}
		/>
		<Input bind:val={formData.workSituationDate} inputLabel="Depuis le" type="date" />
		<Radio2
			caption={'Revenu de solidarité active (RSA)'}
			bind:selected={formData.rightRsa}
			options={rsaRightKeys.options}
		/>

		<Checkbox2 bind:value={formData.rightAre} name="rightAre" label="ARE" />
		<Checkbox2 bind:value={formData.rightAss} name="rightAss" label="ASS" />
		<Checkbox2 bind:value={formData.rightRqth} name="rightRqth" label="RQTH" />
		<Checkbox2 bind:value={formData.rightBonus} name="rightBonus" label="Prime d'activité" />

		<Radio2
			caption={'Zone géographique privilégiée'}
			bind:selected={formData.geographicalArea}
			options={geographicalAreaKeys.options}
		/>

		<Select2
			selectLabel={"Niveau d'étude le plus élevé"}
			options={educationLevelKeys.options}
			bind:selected={formData.educationLevel}
		/>

		<div class="flex flex-row">
			<Button type="submit">Enregistrer</Button>
			<Button outline>Annuler</Button>
		</div>
	</form>
</div>
