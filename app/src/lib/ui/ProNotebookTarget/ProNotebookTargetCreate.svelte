<script lang="ts">
	import {
		AddNotebookTargetDocument,
		GetRefTargetByFocusDocument,
		RefThemeEnum,
	} from '$lib/graphql/_gen/typed-document-nodes';
	import { openComponent } from '$lib/stores';
	import { trackEvent } from '$lib/tracking/matomo';
	import { Button, Select } from '$lib/ui/base';
	import { mutation, operationStore, query } from '@urql/svelte';
	import { LoaderIndicator } from '$lib/ui/utils';

	export let focusId: string;
	export let focusTheme: RefThemeEnum;

	function close() {
		openComponent.close();
	}
	function transformTheme(focusTheme: RefThemeEnum): RefThemeEnum[] {
		switch (focusTheme) {
			case 'emploi':
				return [
					RefThemeEnum.ChoisirUnMetier,
					RefThemeEnum.PreparerSaCandidature,
					RefThemeEnum.TrouverUnEmploi,
					RefThemeEnum.CreerUneEntreprise,
					RefThemeEnum.SOuvrirALInternational,
				];
			case 'formation':
				return [RefThemeEnum.SeFormer];
			default:
				return [focusTheme];
		}
	}
	const refTargetStore = operationStore(GetRefTargetByFocusDocument, {
		theme: transformTheme(focusTheme),
	});
	query(refTargetStore);

	const addNotebookTargetStore = operationStore(AddNotebookTargetDocument, null, {
		additionalTypenames: ['notebook_event'],
	});
	const addNotebookTarget = mutation(addNotebookTargetStore);

	function initFormData() {
		return {
			target: null,
		};
	}

	const formData = initFormData();

	async function createTarget() {
		trackEvent('pro', 'notebook', `add target ${formData.target}`);
		await addNotebookTarget({
			focusId,
			target: formData.target,
		});

		openComponent.close();
	}

	$: targetOptions =
		$refTargetStore.data?.refTargets.map(({ description, refTheme }) => ({
			label: description,
			name: description,
			group: refTheme.label,
		})) || [];

	$: disabled = !formData.target;
</script>

<section class="flex flex-col gap-4">
	<div>
		<h1>Ajouter un objectif</h1>
		<p class="my-6">Veuillez sélectionner un objectif</p>
	</div>
	<LoaderIndicator result={refTargetStore}>
		<div class="min-w-0">
			<Select
				selectLabel={'Objectif'}
				options={targetOptions}
				bind:selected={formData.target}
				groupOption
			/>
		</div>
		<div class="flex flex-row gap-6 pt-4 pb-12">
			<Button {disabled} on:click={createTarget}>Ajouter</Button>
			<Button outline={true} on:click={close}>Annuler</Button>
		</div>
	</LoaderIndicator>
</section>
