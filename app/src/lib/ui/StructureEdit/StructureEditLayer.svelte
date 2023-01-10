<script lang="ts">
	import {
		type GetStructuresForDeploymentQuery,
		UpdateStructureDocument,
		RoleEnum,
	} from '$lib/graphql/_gen/typed-document-nodes';
	import { mutation, operationStore } from '@urql/svelte';
	import { Alert } from '$lib/ui/base';
	import type { StructureFormInput } from './structure.schema';
	import StructureCreationForm from './StructureCreationForm.svelte';
	import { homeForRole } from '$lib/routes';
	import { goto } from '$app/navigation';

	export let structure: GetStructuresForDeploymentQuery['structure'][0];
	const updateResult = operationStore(UpdateStructureDocument);
	const updateStructure = mutation(updateResult);

	let error: string;
	async function handleSubmit(values: StructureFormInput) {
		delete values.__typename;

		await updateStructure({
			id: structure.id,
			...values,
		});

		if (updateResult.error) {
			error = "L'enregistrement a échoué.";
		} else {
			goToStructuresList();
		}
	}

	function onCancel() {
		goToStructuresList();
	}

	function goToStructuresList() {
		goto(`${homeForRole(RoleEnum.Manager)}/structures`);
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
