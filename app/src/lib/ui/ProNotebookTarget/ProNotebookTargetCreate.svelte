<script lang="ts">
	import {
		AddNotebookTargetDocument,
		GetRefTargetByFocusDocument,
		RefThemeEnum,
	} from '$lib/graphql/_gen/typed-document-nodes';
	import { openComponent } from '$lib/stores';
	import { trackEvent } from '$lib/tracking/matomo';
	import { Button, Radio, Select } from '$lib/ui/base';
	import { mutation, operationStore, query } from '@urql/svelte';
	import { LoaderIndicator } from '$lib/ui/utils';
	import { contractTypeFullKeys } from '$lib/constants/keys';

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

	const addNotebookTarget = mutation(
		operationStore(AddNotebookTargetDocument, null, {
			additionalTypenames: ['notebook_event', 'notebook_target'],
		})
	);

	function initFormData() {
		return {
			target: null,
			linkedTo: null,
		};
	}

	const formData = initFormData();

	async function createTarget() {
		trackEvent('pro', 'notebook', `add target ${formData.target}`);
		await addNotebookTarget({
			focusId,
			target: formData.target,
			linkedTo: formData.linkedTo,
		});

		openComponent.close();
	}

	$: targetOptions =
		$refTargetStore.data?.refTargets.map(({ description, refTheme }) => ({
			label: description,
			name: description,
			group: refTheme.label,
		})) || [];

	$: disabled = !formData.target || !formData.linkedTo;
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
		<Radio
			caption={'Veuillez sélectionner le type de contrat lié à cet objectif.'}
			bind:selected={formData.linkedTo}
			options={contractTypeFullKeys.options}
		/>
		<div class="flex flex-row gap-6 pt-4 pb-12">
			<Button {disabled} on:click={createTarget}>Ajouter</Button>
			<Button outline={true} on:click={close}>Annuler</Button>
		</div>
	</LoaderIndicator>
</section>
