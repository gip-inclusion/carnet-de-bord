<script context="module" lang="ts">
	import {
		InsertStructureDocument,
		InsertStructureMutation,
		InsertStructureMutationVariables,
		UpdateStructureDocument,
		UpdateStructureMutation,
		UpdateStructureMutationVariables,
	} from '$lib/graphql/_gen/typed-document-nodes';
	import type { Structure, StructureRequest, InputItem } from '$lib/types';
	import { Alert, Button, Input } from '$lib/ui/base';
	import { default as deepEqual } from 'fast-deep-equal';
	import { createEventDispatcher } from 'svelte';
	import { operationStore, mutation } from '@urql/svelte';
	import type { OperationStore } from '@urql/svelte';
	import * as RD from '$lib/remoteData';

	let inputs: InputItem[] = [
		{
			label: 'Nom',
			hint: 'Ex : Mission locale de Crest',
			key: 'name',
			required: true,
		},
		{
			label: 'Téléphone',
			hint: 'Ex : 04 75 76 70 67',
			key: 'phone',
			required: true,
		},
		{
			label: 'Courriel',
			hint: 'Ex : crest@mission-locale.fr',
			key: 'email',
			type: 'email',
			required: true,
		},
		{
			label: 'Adresse',
			hint: 'Ex : 3 Rue des Cuiretteries',
			key: 'address1',
			required: true,
		},
		{
			label: 'Adresse (complément)',
			hint: 'Ex : Conseiller en réinsertion',
			key: 'address2',
		},
		{
			label: 'Code postal',
			hint: 'Ex : 26400',
			key: 'postalCode',
			required: true,
		},
		{
			label: 'Ville',
			hint: 'Ex : Crest',
			key: 'city',
			required: true,
		},
		{
			label: 'Site internet',
			hint: 'Ex : https://www.mission-locale.fr/crest',
			key: 'website',
		},
		{
			label: 'Siret',
			hint: 'Ex : XXX XXX XXX XXXXX',
			key: 'siret',
		},
		{
			label: 'Description',
			hint: 'Ex : Antenne de Crest de la Mission locale Auvergne Rhône-Alpes',
			key: 'shortDesc',
		},
	];
</script>

<script lang="ts">
	export let structure: StructureRequest;
	export let fieldErrors: StructureRequest;
	export let confirmText = 'Confirmer';
	export let onCancel: () => void | null = null;
	export let disabledKeys: Record<InputItem['key'], boolean> = {};
	export let structureId: string | null = null;

	let originalStructure = { ...structure };

	$: untouched = deepEqual(structure, originalStructure);
	$: isValid = validateStructure(structure);

	const dispatch = createEventDispatcher();

	function validateStructure({ name }: StructureRequest) {
		return Boolean(name);
	}

	const updateStore: OperationStore<
		UpdateStructureMutation,
		UpdateStructureMutationVariables,
		Structure
	> = operationStore(UpdateStructureDocument);
	const insertStore: OperationStore<
		InsertStructureMutation,
		InsertStructureMutationVariables,
		Structure
	> = operationStore(InsertStructureDocument);
	const updater = mutation(updateStore);
	const inserter = mutation(insertStore);
	let mutationResult: RD.RemoteData<Structure, string> = RD.notAsked;

	insertStore.subscribe((result) => {
		if (result.data) {
			mutationResult = RD.success(result.data);
		}
		if (result.error) {
			const err = result.error.toString();
			mutationResult = RD.failure(err);
		}
	});
	updateStore.subscribe((result) => {
		if (result.data) {
			mutationResult = RD.success(result.data);
		}
		if (result.error) {
			const err = result.error.toString();
			mutationResult = RD.failure(err);
		}
	});

	function onInput() {
		mutationResult = RD.notAsked;
	}

	async function handleSubmit() {
		mutationResult = RD.loading;
		if (structureId) {
			updater({ ...structure, id: structureId });
		} else {
			inserter({ ...structure });
		}
		dispatch('submit', { structure });
	}

	async function handleCancel() {
		if (onCancel) {
			onCancel();
		}
		dispatch('cancel', {});
	}
</script>

<div class="w-full">
	{#if RD.getData(mutationResult)}
		<div role="status">
			<h2 class="text-france-blue fr-h4 pt-8 px-8">
				{structureId ? 'Création' : 'Modification'} d'une structure
			</h2>
			<div class="w-full p-8">
				<Alert type="success" description={'La structure a été enregistrée avec succès !'} />
			</div>
			<div class="w-full px-8">
				<Button on:click={handleCancel}>J'ai compris</Button>
			</div>
		</div>
	{:else}
		<h2 class="text-france-blue fr-h4 pt-8 px-8">
			{structureId ? 'Création' : 'Modification'} d'une structure
		</h2>
		<form class="w-full px-8 pb-8" on:submit|preventDefault={handleSubmit}>
			{#each inputs as input (input.key)}
				<Input
					bind:val={structure[input.key]}
					inputHint={input.hint}
					inputLabel={input.label}
					error={fieldErrors[input.key]}
					on:input={onInput}
					disabled={disabledKeys[input.key]}
					type={input.type}
					required={input.required}
				/>
			{/each}
			{#if RD.getError(mutationResult)}
				<div class="mb-8">
					<Alert type="error" description={RD.getError(mutationResult)} />
				</div>
			{/if}
			<div class="flex flex-row gap-6 mt-12">
				<Button type="submit" disabled={!isValid || untouched || RD.isLoading(mutationResult)}
					>{confirmText}</Button
				>
				<Button outline={true} on:click={handleCancel}>Annuler</Button>
			</div>
		</form>
	{/if}
</div>
