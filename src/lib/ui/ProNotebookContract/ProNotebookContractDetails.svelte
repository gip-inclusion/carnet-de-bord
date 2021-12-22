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

	function onChange(event: { detail: { value: string } }): void {
		if ('no' == event.detail.value) {
			formData.contractSignDate = null;
		}
	}

	async function saveContract() {
		await updateNotebookContract({
			id: notebook.id,
			...formData,
			contractSignDate: formData.contractSignDate,
		});
		close();
	}

	$: isContract = 'no' !== formData.contractType;

	$: disabled = isContract
		? !formData.contractType || !formData.contractSignDate
		: !formData.contractType;
</script>

<section>
	<h1>Type de contrat</h1>
	<form on:submit|preventDefault={saveContract}>
		<Radio
			caption={'Veuillez sélectionner le type de contrat.'}
			bind:selected={formData.contractType}
			options={contractTypeFullKeys.options}
			on:input={onChange}
		/>
		{#if isContract}
			<Input
				bind:value={formData.contractSignDate}
				inputLabel="Date de signature"
				type="date"
				required={true}
			/>
		{/if}
		<div class="flex flex-row gap-6">
			<Button {disabled} type="submit">Enregistrer</Button>
			<Button outline={true} on:click={close}>Annuler</Button>
		</div>
	</form>
</section>
