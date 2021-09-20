<script lang="ts">
	import { contractTypeFullKeys } from '$lib/constants/keys';
	import {
		GetRefSituationsByThemeDocument,
		NotebookFocus,
		UpdateNotebookFocusDocument,
	} from '$lib/graphql/_gen/typed-document-nodes';
	import { openComponent } from '$lib/stores';
	import { Button, Checkboxes, Radio } from '$lib/ui/base';
	import { mutation, operationStore, query } from '@urql/svelte';
	import { buildSituationOptions } from './focusOptionsBuilder';

	export let focus: Pick<NotebookFocus, 'id' | 'theme' | 'situations' | 'linkedTo'>;

	const refSituationStore = operationStore(GetRefSituationsByThemeDocument, { theme: focus.theme });
	query(refSituationStore);

	function close() {
		openComponent.close();
	}

	const updateNotebookFocusStore = operationStore(UpdateNotebookFocusDocument);
	const updateNotebookFocus = mutation(updateNotebookFocusStore);

	function initFormData() {
		return {
			linkedTo: focus.linkedTo,
			situations: focus.situations,
		};
	}

	const formData = initFormData();

	$: disabled = !formData.linkedTo && formData.situations?.length > 0;

	async function updateFocus() {
		await updateNotebookFocus({
			id: focus.id,
			situations: formData.situations,
			linkedTo: formData.linkedTo,
		});
		openComponent.close();
	}

	let situationOptions = buildSituationOptions($refSituationStore.data?.refSituations);
</script>

<div class="flex flex-col gap-6 mb-6">
	<div>
		<h1>{focus.theme}</h1>
		<p class="mb-0">
			Veuillez renseigner les informations ci-dessous pour modifier l'axe de travail.
		</p>
	</div>
	<div>
		<Radio
			caption={"Veuillez sélectionner le type de contrat intégrant l'axe de travail."}
			bind:selected={formData.linkedTo}
			options={contractTypeFullKeys.options}
		/>
	</div>
	<div>
		<h2 class="fr-h4 bf-500">Situation</h2>
		{#if situationOptions.length === 0}
			<p>Aucune situation ne correspond à ce thème.</p>
		{:else}
			<Checkboxes
				globalClassNames={'flex flex-row flex-wrap gap-4'}
				checkboxesCommonClassesNames={`!mt-0 w-5/12`}
				caption={''}
				bind:selectedOptions={formData.situations}
				options={situationOptions}
			/>
		{/if}
	</div>
	<div class="h-full flex-stretch">{' '}</div>
	<div>
		<Button {disabled} on:click={updateFocus}>Valider</Button>
		<Button outline={true} on:click={close}>Annuler</Button>
	</div>
</div>

<style lang="postcss">
	.bf-500 {
		color: var(--bf500);
	}
</style>
