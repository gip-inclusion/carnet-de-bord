<script lang="ts">
	import {
		AddNotebookActionDocument,
		GetRefActionsDocument,
		GetStructuresDocument,
		NotebookTarget,
	} from '$lib/graphql/_gen/typed-document-nodes';
	import { mutation, operationStore, query } from '@urql/svelte';
	import { Button, Select } from '$lib/ui/base';
	import { trackEvent } from '$lib/tracking/matomo';

	export let target: Pick<NotebookTarget, 'id' | 'target'>;
	export let theme: string;

	const actionStore = operationStore(GetRefActionsDocument, { theme });
	query(actionStore);

	const stuctureStore = operationStore(GetStructuresDocument, {});
	query(stuctureStore);

	const createActionStore = operationStore(AddNotebookActionDocument);
	const createActionMutation = mutation(createActionStore);
	$: actionOptions =
		$actionStore.data?.refActions.map(({ description }) => ({
			label: description,
			name: description,
		})) || [];

	function initFormData() {
		return {
			action: null,
		};
	}

	let formData = initFormData();

	async function createAction() {
		trackEvent('pro', 'notebook', `add action ${formData.action}`);
		await createActionMutation({
			action: formData.action,
			targetId: target.id,
			status: 'new',
		});
		formData = initFormData();
	}

	$: disabled = !formData.action;
</script>

<form on:submit|preventDefault={createAction} class="pb-4">
	<div class="flex flex-row justify-between gap-6">
		<div class=" w-9/12">
			<Select selectLabel={'Actions'} options={actionOptions} bind:selected={formData.action} />
		</div>
		<div class="self-end w-3/12">
			<Button type="submit" {disabled}>Ajouter</Button>
		</div>
	</div>
</form>
