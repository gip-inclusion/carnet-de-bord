<script lang="ts">
	import { session } from '$app/stores';
	import { contractTypeFullKeys, focusThemeKeys } from '$lib/constants/keys';
	import {
		AddNotebookFocusDocument,
		GetRefSituationsDocument,
	} from '$lib/graphql/_gen/typed-document-nodes';
	import { openComponent } from '$lib/stores';
	import { Button, Checkboxes, Radio, Select } from '$lib/ui/base';
	import { mutation, operationStore, query } from '@urql/svelte';
	import { buildSituationOptions } from './focusOptionsBuilder';
	import ProNotebookFocusConfirmation from './ProNotebookFocusConfirmation.svelte';

	export let notebookId: string | null;

	const refSituationStore = operationStore(GetRefSituationsDocument);
	query(refSituationStore);

	function close() {
		openComponent.close();
	}

	const addNotebookFocusStore = operationStore(AddNotebookFocusDocument);
	const addNotebookFocus = mutation(addNotebookFocusStore);

	function initFormData() {
		return {
			theme: null,
			linkedTo: null,
			situations: [],
		};
	}

	const formData = initFormData();

	let disabled = !formData.theme && !formData.linkedTo && formData.situations?.length > 0;

	async function createFocus() {
		const store = await addNotebookFocus({
			notebookId,
			theme: formData.theme,
			situations: formData.situations,
			linkedTo: formData.linkedTo,
		});
		if (store.error) {
			console.log('createFocus error', {
				error: store.error,
				creatorId: $session.user.professionalId,
			});
		} else {
			openComponent.open({ component: ProNotebookFocusConfirmation });
		}
	}

	function getSituationOptions() {
		if (!formData.theme) {
			return [];
		}
		const refSituations = $refSituationStore.data?.refSituations || [];
		const filtered = refSituations.filter(({ theme: t }) => t === formData.theme);
		return buildSituationOptions(filtered);
	}

	let situationOptions = buildSituationOptions();

	function selectTheme() {
		formData.situations = [];
		situationOptions = getSituationOptions();
	}
</script>

<div class="flex flex-col gap-6 mb-6">
	<div>
		<h1>Ajouter un axe de travail</h1>
		<p class="mb-0">
			Veuillez renseigner les informations ci-dessous pour créer un nouvel axe de travail.
		</p>
	</div>
	<div>
		<h2 class="fr-h4 bf-500">Axe de travail</h2>
		<Radio
			caption={"Veuillez sélectionner le type de contrat intégrant l'axe de travail."}
			bind:selected={formData.linkedTo}
			options={contractTypeFullKeys.options}
		/>
		<Select
			selectLabel={'Thème'}
			options={focusThemeKeys.options}
			bind:selected={formData.theme}
			on:select={() => selectTheme()}
		/>
	</div>
	{#if formData.theme}
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
	{/if}
	<div class="py-4">
		<Button {disabled} on:click={createFocus}>Valider</Button>
		<Button outline={true} on:click={close}>Annuler</Button>
	</div>
</div>

<style lang="postcss">
	.bf-500 {
		color: var(--bf500);
	}
</style>
