<script lang="ts">
	import {
		GetOrientationTypeDocument,
		type GetOrientationTypeQuery,
		OrientationTypeEnum,
		UpdateOrientationDocument,
	} from '$lib/graphql/_gen/typed-document-nodes';
	import { Select } from '../base';
	import { mutation, operationStore, query } from '@urql/svelte';
	import type { OperationStore } from '@urql/svelte';
	import Button from '../base/Button.svelte';
	import { openComponent } from '$lib/stores';
	import Alert from '../base/Alert.svelte';
	import { pluralize } from '$lib/helpers';
	import LoaderIndicator from '$lib/ui/utils/LoaderIndicator.svelte';

	export let orientation_type: OrientationTypeEnum = null;
	export let notebooks: { beneficiaryId: string; notebookId: string }[];

	export let onClose: () => void;

	const orientationTypeStore: OperationStore<GetOrientationTypeQuery> = operationStore(
		GetOrientationTypeDocument
	);
	query(orientationTypeStore);

	$: orientationsOptions =
		$orientationTypeStore.data?.orientation_type.map(({ id, label }) => ({
			name: id,
			label: label,
		})) ?? [];

	const updateOrientationType = mutation({ query: UpdateOrientationDocument });

	let selectedOrientation = orientation_type;
	let error = false;

	async function handleSubmit() {
		const updateResponse = await updateOrientationType(
			{
				objects: notebooks.map(({ beneficiaryId }) => ({
					beneficiaryId,
					orientationSystemId: selectedOrientation,
				})),
			},
			{ additionalTypenames: ['notebook_info'] }
		);
		if (updateResponse.error) {
			error = true;
			console.error(updateResponse.error);
			return;
		}
		if (onClose) onClose();
		openComponent.close();
	}

	function close() {
		openComponent.close();
	}
</script>

<section class="flex flex-col w-full">
	<h1>Type d'orientation</h1>
	<form on:submit|preventDefault={handleSubmit}>
		<LoaderIndicator result={orientationTypeStore}>
			<p>
				Veuillez sélectionner le type d'orientation {pluralize('du', notebooks.length, 'des')}
				{pluralize('bénéficiaire', notebooks.length)}.
			</p>
			<Select
				bind:selected={selectedOrientation}
				selectLabel={selectedOrientation ? 'Nouvelle orientation' : 'Orientation'}
				selectHint="Sélectionner un type d'orientation"
				options={orientationsOptions}
				name="orientation_type"
				id="orientation_type"
			/>
			{#if error}
				<Alert type="error" size="sm">Impossible de modifier le type d'orientation</Alert>
			{/if}
			<div class="pt-4">
				<Button type="submit">Enregistrer</Button>
				<Button outline on:click={close}>Annuler</Button>
			</div>
		</LoaderIndicator>
	</form>
</section>
