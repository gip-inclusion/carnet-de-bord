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
	const updateResult = operationStore(UpdateStructureDocument);
	const updateStructure = mutation(updateResult);

	let alertMessage: string;
	let showAlert = false;
	let alertType: 'success' | 'error' = 'success';

	async function handleSubmit(values: StructureFormInput) {
		showAlert = false;

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

		showAlert = true;

		if (updateResult.error) {
			alertMessage = "L'enregistrement a échoué.";
			alertType = 'error';
		} else {
			alertMessage = 'Les informations de la structure ont été mises à jour.';
			alertType = 'success';
		}
	}
</script>

<div class="flex flex-col gap-4">
	<h1>Mettre à jour les informations de structure</h1>
	<StructureCreationForm onSubmit={handleSubmit} initialValues={structure} />
	{#if showAlert}
		<div class="mb-8">
			<Alert type={alertType} description={alertMessage} />
		</div>
	{/if}
</div>
