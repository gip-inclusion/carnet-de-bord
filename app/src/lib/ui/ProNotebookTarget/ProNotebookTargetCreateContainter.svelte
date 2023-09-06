<script lang="ts">
	import {
		AddNotebookTargetDocument,
		GetRefTargetByFocusDocument,
		RefThemeEnum,
	} from '$lib/graphql/_gen/typed-document-nodes';
	import { openComponent } from '$lib/stores';
	import { trackEvent } from '$lib/tracking/matomo';
	import { mutation, operationStore, query } from '@urql/svelte';
	import { LoaderIndicator } from '$lib/ui/utils';
	import ProNotebookTargetCreate from './ProNotebookTargetCreate.svelte';
	import type { AddTargetPayload } from '.';

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

	async function createTarget(event: CustomEvent<AddTargetPayload>) {
		trackEvent('pro', 'notebook', `add target ${event.detail.target}`);
		await addNotebookTarget({
			focusId,
			target: event.detail.target,
			linkedTo: event.detail.linkedTo,
		});

		openComponent.close();
	}
</script>

<section class="flex flex-col gap-4">
	<div>
		<h1>Ajouter un objectif</h1>
		<p class="my-6">Veuillez sélectionner un objectif</p>
	</div>
	<LoaderIndicator result={refTargetStore}>
		<ProNotebookTargetCreate
			targets={$refTargetStore.data?.refTargets}
			on:create-target={createTarget}
			on:cancel={close}
		/>
	</LoaderIndicator>
</section>
