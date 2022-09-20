<script lang="ts">
	import {
		GetOrientationManagerDocument,
		GetOrientationManagerQuery,
		UpdateOrientationManagerDocument,
	} from '$lib/graphql/_gen/typed-document-nodes';
	import { Select } from '../base';
	import { displayFullName } from '../format';
	import { operationStore, mutation, query } from '@urql/svelte';
	import type { OperationStore } from '@urql/svelte';
	import Button from '../base/Button.svelte';
	import { openComponent } from '$lib/stores';
	import Alert from '../base/Alert.svelte';
	import { pluralize } from '$lib/helpers';
	import LoaderIndicator from '$lib/ui/utils/LoaderIndicator.svelte';

	export let member: string = null;
	export let notebooks: { beneficiaryId: string; notebookId: string }[];

	export let onClose: () => void;

	let orientationManagerStore: OperationStore<GetOrientationManagerQuery> = operationStore(
		GetOrientationManagerDocument
	);
	query(orientationManagerStore);

	$: orientationManagerOptions =
		$orientationManagerStore.data?.orientation_manager.map((pro) => ({
			name: pro.account.id,
			label: displayFullName(pro) || pro.email,
		})) ?? [];

	const updateOrientationManager = mutation({ query: UpdateOrientationManagerDocument });

	let selectedMember = member;
	let error = false;

	async function handleSubmit() {
		const updateResponse = await updateOrientationManager(
			{
				objects: notebooks.map(({ notebookId }) => ({
					notebookId,
					memberType: 'orientation_manager',
					accountId: selectedMember,
					active: true,
				})),
				beneficiaries: notebooks.map(({ beneficiaryId }) => beneficiaryId),
			},
			{ additionalTypenames: ['notebook_member'] }
		);
		if (updateResponse.error) {
			error = true;
			console.log(updateResponse.error);
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
	<h1>Assigner un chargé d'orientation</h1>
	<form on:submit|preventDefault={handleSubmit}>
		<LoaderIndicator result={orientationManagerStore}>
			<p>
				Veuillez sélectionner le chargé d'orientation {pluralize('du', notebooks.length, 'des')}
				{pluralize('bénéficiaire', notebooks.length)}.
			</p>
			<Select
				bind:selected={selectedMember}
				selectLabel={member ? 'Nom du nouveau chargé d’orientation' : 'Nom du chargé d’orientation'}
				selectHint="Sélectionner un chargé d'orientation"
				options={orientationManagerOptions}
				name="orientation_manager"
				id="orientation_manager"
			/>
			{#if error}
				<Alert type="error" size="sm">Impossible de modifier le charge d'orientation</Alert>
			{/if}
			<div class="pt-4">
				<Button type="submit">Assigner</Button>
				<Button outline on:click={close}>Annuler</Button>
			</div>
		</LoaderIndicator>
	</form>
</section>
