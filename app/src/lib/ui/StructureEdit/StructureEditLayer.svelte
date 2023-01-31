<script lang="ts">
	import {
		type GetStructureByIdQuery,
		UpdateStructureDocument,
	} from '$lib/graphql/_gen/typed-document-nodes';
	import { mutation, operationStore } from '@urql/svelte';
	import { Alert } from '$lib/ui/base';
	import type { StructureFormInput } from './structure.schema';
	import StructureCreationForm from './StructureCreationForm.svelte';
	import type { LabelName } from '$lib/types';
	import { getOrientationSystemLabel } from '$lib/utils/getOrientationSystemLabel';

	export let structure: GetStructureByIdQuery['structure_by_pk'];
	export let deploymentOrientationSystems: GetStructureByIdQuery['orientation_system'];
	export let onClose: () => void;
	const updateResult = operationStore(UpdateStructureDocument);
	const updateStructure = mutation(updateResult);

	let errorMessage: string;

	async function handleSubmit(values: StructureFormInput, orientationSystems: string[]) {
		const currentOrientationSystemIds = structure.orientationSystems.map(
			({ orientationSystem }) => orientationSystem.id
		);
		const orientationSystemsToAdd = orientationSystems
			.filter((orientationSystem) => !currentOrientationSystemIds.includes(orientationSystem))
			.map((orientationSystemId) => {
				return { orientationSystemId, structureId: structure.id };
			});
		const orientationSystemsToDelete = currentOrientationSystemIds.filter(
			(orientationSystemId) => !orientationSystems.includes(orientationSystemId)
		);

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
			orientationSystemsToAdd,
			orientationSystemsToDelete,
		});

		if (updateResult.error) {
			errorMessage = "L'enregistrement a échoué.";
		} else {
			onClose();
		}
	}

	function buildOrientationSystemOptions(): LabelName[] {
		return deploymentOrientationSystems.map((orientationSystem) => {
			return {
				label: getOrientationSystemLabel(orientationSystem),
				name: orientationSystem.id,
			};
		});
	}
</script>

<div class="flex flex-col gap-4">
	<h1>Mettre à jour les informations de structure</h1>
	<StructureCreationForm
		onSubmit={handleSubmit}
		onCancel={onClose}
		initialValues={structure}
		orientationSystemOptions={buildOrientationSystemOptions()}
	/>
	{#if errorMessage}
		<div class="mb-8">
			<Alert type="error" description={errorMessage} />
		</div>
	{/if}
</div>
