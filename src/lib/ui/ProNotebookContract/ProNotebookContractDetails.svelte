<script lang="ts">
	import { contractTypeFullKeys } from '$lib/constants/keys';

	import { Notebook, UpdateNotebookContractDocument } from '$lib/graphql/_gen/typed-document-nodes';
	import { openComponent } from '$lib/stores';
	import { Button, Input, Radio } from '$lib/ui/base';
	import { mutation, operationStore } from '@urql/svelte';

	export let notebook: Pick<Notebook, 'id' | 'contractType' | 'contractSignDate'>;

	const updateNotebookContractStore = operationStore(UpdateNotebookContractDocument);
	const updateNotebookContract = mutation(updateNotebookContractStore);

	function initFormData() {
		return {
			contractType: notebook.contractType,
			contractSignDate: notebook.contractSignDate,
		};
	}

	const formData = initFormData();

	function close() {
		openComponent.close();
	}

	async function saveContract() {
		await updateNotebookContract({
			id: notebook.id,
			...formData,
		});
		close();
	}
</script>

<div class="flex flex-col gap-6 mb-6">
	<h1>Type de contrat</h1>
	<form on:submit|preventDefault={saveContract}>
		<Radio
			caption={'Veuillez sélectionner le type de contrat.'}
			bind:selected={formData.contractType}
			options={contractTypeFullKeys.options}
		/>
		<Input bind:val={formData.contractSignDate} inputLabel="Date de signature" type="date" />
		<div class="flex flex-row">
			<Button type="submit">Enregistrer</Button>
			<Button outline={true} on:click={close}>Annuler</Button>
		</div>
	</form>
</div>
