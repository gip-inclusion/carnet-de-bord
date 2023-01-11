<script lang="ts">
	import {
		type GetStructuresForDeploymentQuery,
		UpdateStructureDocument,
	} from '$lib/graphql/_gen/typed-document-nodes';
	import { mutation, operationStore } from '@urql/svelte';
	import { Alert } from '$lib/ui/base';
	import type { StructureFormInput } from './structure.schema';
	import StructureCreationForm from './StructureCreationForm.svelte';

	export let structure: GetStructuresForDeploymentQuery['structure'][0];
	export let onClose: () => void;
	const updateResult = operationStore(UpdateStructureDocument);
	const updateStructure = mutation(updateResult);

	let errorMessage: string;

	async function handleSubmit(values: StructureFormInput) {
		await updateStructure({
			id: structure.id,
			name: values.name,
			shortDesc: values.shortDesc,
			email: values.email,
			phone: values.phone,
			siret: values.siret,
			address1: values.address1,
			address2: values.address2,
			postalCode: values.postalCode,
			city: values.city,
			website: values.website,
		});

		if (updateResult.error) {
			errorMessage = "L'enregistrement a échoué.";
		} else {
			onClose();
		}
	}
</script>

<div class="flex flex-col gap-4">
	<h1>Mettre à jour les informations de structure</h1>
	<StructureCreationForm onSubmit={handleSubmit} onCancel={onClose} initialValues={structure} />
	{#if errorMessage}
		<div class="mb-8">
			<Alert type="error" description={errorMessage} />
		</div>
	{/if}
</div>
