<script lang="ts">
	import {
		AddNotebookTargetDocument,
		GetRefTargetByFocusDocument,
	} from '$lib/graphql/_gen/typed-document-nodes';
	import { openComponent } from '$lib/stores';
	import { Button, Select } from '$lib/ui/base';
	import { mutation, operationStore, query } from '@urql/svelte';
	import ProNotebookFocusDetails from '$lib/ui/ProNotebookFocus/ProNotebookFocusDetails.svelte';

	export let focusId: string;
	export let focusTheme: string;

	function close() {
		openComponent.close();
	}

	const refTargetStore = operationStore(GetRefTargetByFocusDocument, { theme: focusTheme });
	query(refTargetStore);

	const addNotebookTargetStore = operationStore(AddNotebookTargetDocument);
	const addNotebookTarget = mutation(addNotebookTargetStore);

	function initFormData() {
		return {
			target: null,
		};
	}

	const formData = initFormData();

	async function createTarget() {
		await addNotebookTarget({
			focusId,
			target: formData.target,
		});
		openComponent.open({ component: ProNotebookFocusDetails, props: { focusId } });
	}

	$: targetOptions =
		$refTargetStore.data?.refTargets.map(({ description }) => ({
			label: description,
			name: description,
		})) || [];

	$: disabled = !formData.target;
</script>

<section>
	<div>
		<h1>Ajouter un objectif</h1>
		<p class="mb-0">Veuillez sélectionner un objectif</p>
	</div>
	<div>
		<Select selectLabel={'Objectif'} options={targetOptions} bind:selected={formData.target} />
	</div>
	<div class="flex flex-row gap-6 pt-4 pb-12">
		<Button {disabled} on:click={createTarget}>Valider</Button>
		<Button outline={true} on:click={close}>Annuler</Button>
	</div>
</section>
