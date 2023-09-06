<script lang="ts">
	import { connectedUser } from '$lib/stores';
	import { focusThemeKeys } from '$lib/constants/keys';
	import { AddNotebookFocusDocument } from '$lib/graphql/_gen/typed-document-nodes';
	import { openComponent } from '$lib/stores';
	import { trackEvent } from '$lib/tracking/matomo';
	import { Button, Select } from '$lib/ui/base';
	import { mutation, operationStore } from '@urql/svelte';
	import ProNotebookFocusConfirmation from './ProNotebookFocusConfirmation.svelte';

	export let notebookId: string | null;

	function close() {
		openComponent.close();
	}

	const addNotebookFocus = mutation(
		operationStore(AddNotebookFocusDocument, null, { additionalTypenames: ['notebook_focus'] })
	);

	function initFormData() {
		return {
			theme: null,
		};
	}

	const formData = initFormData();

	$: disabled = !formData.theme;

	async function createFocus() {
		trackEvent('pro', 'notebook', `add focus ${formData.theme}`);
		const store = await addNotebookFocus({
			notebookId,
			theme: formData.theme,
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
		<h2 class="fr-h4 text-vert-cdb">Axe de travail</h2>
		<Select selectLabel={'Thème'} options={focusThemeKeys.options} bind:selected={formData.theme} />
	</div>
	<div class="py-4 flex flex-row gap-6">
		<Button {disabled} on:click={createFocus}>Valider</Button>
		<Button outline={true} on:click={close}>Annuler</Button>
	</div>
</div>
