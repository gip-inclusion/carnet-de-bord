<script lang="ts">
	import {
		ActionStatusEnum,
		AddNotebookActionDocument,
		GetRefActionsDocument,
		type NotebookTarget,
	} from '$lib/graphql/_gen/typed-document-nodes';
	import { mutation, operationStore, query } from '@urql/svelte';
	import { Button } from '$lib/ui/base';
	import { trackEvent } from '$lib/tracking/matomo';
	import LoaderIndicator from '../utils/LoaderIndicator.svelte';
	import Autocomplete, { type AutoCompleteOption } from '../base/Autocomplete.svelte';

	export let target: Pick<NotebookTarget, 'id' | 'target'>;
	export let theme: string;

	const actionStore = operationStore(GetRefActionsDocument);
	query(actionStore);

	const createActionStore = operationStore(AddNotebookActionDocument);
	const createActionMutation = mutation(createActionStore);

	let actionOptions: AutoCompleteOption[];

	actionStore.subscribe((store) => {
		if (store.fetching || store.error) {
			return;
		}

		const themeActions = store.data.actions
			.filter((a) => a.theme === theme)
			.sort((a1, a2) => a1.description.localeCompare(a2.description));
		const otherActions = store.data.actions
			.filter((a) => a.theme !== theme)
			.sort((a1, a2) => a1.description.localeCompare(a2.description));

		actionOptions = themeActions
			.concat(otherActions)
			.map((a) => ({ value: a.id, label: a.description }));
	});

	function initFormData() {
		return {
			action: null,
		};
	}
	let selectedItem: AutoCompleteOption = null;
	let formData = initFormData();

	async function createAction() {
		trackEvent('pro', 'notebook', `add action ${formData.action}`);
		await createActionMutation({
			action: formData.action,
			targetId: target.id,
			status: ActionStatusEnum.InProgress,
		});
		selectedItem = null;
		formData = initFormData();
	}

	$: disabled = !formData.action;
</script>

<LoaderIndicator result={actionStore}>
	<form on:submit|preventDefault={createAction} class="pb-4">
		<div class="flex flex-row justify-between gap-6">
			<div class=" w-9/12">
				<Autocomplete
					on:change={(e) => (formData.action = e.detail.selectedItem.label)}
					placeholder="Sélectionner une action"
					searchPlaceholder="Rechercher une action"
					label="Actions"
					bind:selectedItem
					options={actionOptions}
				/>
			</div>
			<div class="self-end w-3/12">
				<Button type="submit" {disabled}>Ajouter</Button>
			</div>
		</div>
	</form>
</LoaderIndicator>
