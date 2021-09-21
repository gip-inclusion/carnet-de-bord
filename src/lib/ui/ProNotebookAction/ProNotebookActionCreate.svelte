<script lang="ts">
	import {
		AddNotebookActionDocument,
		GetRefActionsDocument,
		GetStructuresDocument,
		NotebookTarget,
	} from '$lib/graphql/_gen/typed-document-nodes';
	import { mutation, operationStore, query } from '@urql/svelte';
	import Svelecte from 'svelecte';
	import { Button, Select } from '$lib/ui/base';

	export let target: Pick<NotebookTarget, 'id' | 'target'>;

	const actionStore = operationStore(GetRefActionsDocument);
	query(actionStore);

	const stuctureStore = operationStore(GetStructuresDocument, {});
	query(stuctureStore);

	const createActionStore = operationStore(AddNotebookActionDocument);
	const createActionMutation = mutation(createActionStore);

	$: structureOptions = $stuctureStore.data?.structure || [];

	$: actionOptions =
		$actionStore.data?.refActions
			.filter(({ target: t }) => t.description === target.target)
			.map(({ description }) => ({ label: description, name: description })) || [];

	function initFormData() {
		return {
			action: null,
			structureId: null,
		};
	}

	let formData = initFormData();

	async function createAction() {
		await createActionMutation({
			action: formData.action,
			structureId: formData.structureId,
			targetId: target.id,
			status: 'new',
		});
		formData = initFormData();
	}

	$: disabled = !(formData.action && formData.structureId);
</script>

<form on:submit|preventDefault={createAction} class="pb-4">
	<div>
		<div class="flex flex-row justify-between">
			<div class="flex flex-row w-9/12">
				<div class="box-border w-1/2 pr-1">
					<Select selectLabel={'Actions'} options={actionOptions} bind:selected={formData.action} />
				</div>
				<div class="box-border w-1/2 pl-2">
					<div class="w-full">
						<label class="flex-grow mb-2 fr-label" for="structureSelect">
							<div>Solliciter une structure</div>
						</label>
						<Svelecte
							options={structureOptions}
							placeholder=""
							bind:value={formData.structureId}
							disableSifter={false}
							class="svelecte-control custom-svelecte"
							valueField="id"
							labelField="name"
							clearable={true}
							vlHeight={60}
						/>
					</div>
				</div>
			</div>
			<div class="self-end w-1/6">
				<Button type="submit" {disabled}>Ajouter</Button>
			</div>
		</div>
	</div>
</form>
