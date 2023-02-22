<script lang="ts">
	import { connectedUser } from '$lib/stores';
	import { contractTypeFullKeys, focusThemeKeys } from '$lib/constants/keys';
	import { AddNotebookFocusDocument } from '$lib/graphql/_gen/typed-document-nodes';
	import { openComponent } from '$lib/stores';
	import { trackEvent } from '$lib/tracking/matomo';
	import { Button, Radio, Select } from '$lib/ui/base';
	import { mutation, operationStore } from '@urql/svelte';
	import ProNotebookFocusConfirmation from './ProNotebookFocusConfirmation.svelte';

	export let notebookId: string | null;

	function close() {
		openComponent.close();
	}

	const addNotebookFocusStore = operationStore(AddNotebookFocusDocument);
	const addNotebookFocus = mutation(addNotebookFocusStore);

	function initFormData() {
		return {
			theme: null,
			linkedTo: null,
		};
	}

	const formData = initFormData();

	$: disabled = !formData.theme && !formData.linkedTo;

	async function createFocus() {
		trackEvent('pro', 'notebook', `add focus ${formData.theme}`);
		const store = await addNotebookFocus({
			notebookId,
			theme: formData.theme,
			linkedTo: formData.linkedTo,
		});
		if (store.error) {
			console.error('createFocus error', {
				error: store.error,
				creatorId: $connectedUser.id,
			});
		} else {
			openComponent.replace({ component: ProNotebookFocusConfirmation });
		}
	}
</script>

<div class="flex flex-col gap-6">
	<div>
		<h1>Ajouter un axe de travail</h1>
		<p class="mb-0">
			Veuillez renseigner les informations ci-dessous pour créer un nouvel axe de travail.
		</p>
	</div>
	<div>
		<h2 class="fr-h4 text-france-blue">Axe de travail</h2>
		<Radio
			caption={"Veuillez sélectionner le type de contrat intégrant l'axe de travail."}
			bind:selected={formData.linkedTo}
			options={contractTypeFullKeys.options}
		/>
		<Select selectLabel={'Thème'} options={focusThemeKeys.options} bind:selected={formData.theme} />
	</div>
	<div class="py-4 flex flex-row gap-6">
		<Button {disabled} on:click={createFocus}>Valider</Button>
		<Button outline={true} on:click={close}>Annuler</Button>
	</div>
</div>
