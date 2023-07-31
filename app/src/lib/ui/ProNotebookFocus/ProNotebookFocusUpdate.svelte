<script lang="ts">
	import { contractTypeFullKeys, focusThemeKeys } from '$lib/constants/keys';
	import {
		type NotebookFocus,
		UpdateNotebookFocusDocument,
	} from '$lib/graphql/_gen/typed-document-nodes';
	import { openComponent } from '$lib/stores';
	import { trackEvent } from '$lib/tracking/matomo';
	import { Button, Radio } from '$lib/ui/base';
	import { mutation, operationStore } from '@urql/svelte';

	export let focus: Pick<NotebookFocus, 'id' | 'theme' | 'linkedTo'>;

	const updateNotebookFocus = mutation(
		operationStore(UpdateNotebookFocusDocument, null, { additionalTypenames: ['notebook_focus'] })
	);

	function initFormData() {
		return {
			linkedTo: focus.linkedTo,
		};
	}

	const formData = initFormData();

	$: disabled = !formData.linkedTo;

	async function updateFocus() {
		trackEvent('pro', 'notebook', `update focus`);
		await updateNotebookFocus({
			id: focus.id,
			linkedTo: formData.linkedTo,
		});
		close();
	}

	function close() {
		openComponent.close();
	}
</script>

<div class="flex flex-col gap-6">
	<div>
		<h1>Modifier l'axe de travail « {focusThemeKeys.byKey[focus.theme]} »</h1>
		<p class="mb-0">
			Veuillez renseigner les informations ci-dessous pour modifier l'axe de travail.
		</p>
	</div>
	<div>
		<h2 class="fr-h4 text-vert-cdb">Axe de travail</h2>
		<Radio
			caption={"Veuillez sélectionner le type de contrat intégrant l'axe de travail."}
			bind:selected={formData.linkedTo}
			options={contractTypeFullKeys.options}
		/>
	</div>
	<div class="h-full flex-stretch">{' '}</div>
	<div class="flex flex-row gap-6">
		<Button {disabled} on:click={updateFocus}>Enregistrer</Button>
		<Button outline={true} on:click={close}>Annuler</Button>
	</div>
</div>
