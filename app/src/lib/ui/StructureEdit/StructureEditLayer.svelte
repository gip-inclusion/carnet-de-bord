<script lang="ts">
	import {
		GetStructuresForDeploymentQuery,
		UpdateStructureDocument,
	} from '$lib/graphql/_gen/typed-document-nodes';
	import { mutation, operationStore } from '@urql/svelte';
	import { openComponent } from '$lib/stores';
	import { Alert } from '$lib/ui/base';
	import type { StructureFormInput } from './structure.schema';
	import StructureCreationForm from './StructureCreationForm.svelte';

	export let structure: GetStructuresForDeploymentQuery['structure'][0];
	const updateResult = operationStore(UpdateStructureDocument);
	const updateStructure = mutation(updateResult);

	let error: string;
	async function handleSubmit(values: StructureFormInput) {
		await updateStructure({
			id: structure.id,
			...values,
		});

		if (updateResult.error) {
			error = "L'enregistrement a échoué.";
		} else {
			openComponent.close();
		}
	}

	function onCancel() {
		openComponent.close();
	}
</script>

<div class="flex flex-col gap-4">
	<h1>Mettre à jour les informations de structure</h1>
	<StructureCreationForm onSubmit={handleSubmit} {onCancel} initialValues={structure} />
	{#if error}
		<div class="mb-8">
			<Alert type="error" description={error} />
		</div>
	{/if}
</div>
