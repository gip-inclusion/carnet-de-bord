<script context="module" lang="ts">
	import {
		InsertStructureDocument,
		UpdateStructureDocument
	} from '$lib/graphql/_gen/typed-document-nodes';
	import type { StructureRequest, InputItem } from '$lib/types';
	import { Button, Input } from '$lib/ui/base';
	import { default as deepEqual } from 'fast-deep-equal';
	import { createEventDispatcher } from 'svelte';
	import { operationStore, mutation } from '@urql/svelte';

	let inputs: InputItem[] = [
		{
			label: 'Nom',
			hint: 'Ex : Mission locale de Crest',
			required: true,
			key: 'name'
		},
		{
			label: 'Téléphone',
			hint: 'Ex : 04 75 76 70 67',
			key: 'phone'
		},
		{
			label: 'Adresse de courriel',
			hint: 'Ex : crest@mission-locale.fr',
			key: 'email',
			type: 'email'
		},
		{
			label: 'Fonction',
			hint: 'Ex : 3 Rue des Cuiretteries',
			key: 'address1'
		},
		{
			label: 'Fonction',
			hint: 'Ex : Conseiller en réinsertion',
			key: 'address2'
		},
		{
			label: 'Code postal',
			hint: 'Ex : 26400',
			key: 'postalCode'
		},
		{
			label: 'Ville',
			hint: 'Ex : Crest',
			key: 'city'
		},
		{
			label: 'Site internet',
			hint: 'Ex : https://www.mission-locale.fr/crest',
			key: 'website'
		},
		{
			label: 'Siret',
			hint: 'Ex : XXX XXX XXX XXXXX',
			key: 'siret'
		},
		{
			label: 'Description',
			hint: 'Ex : Antenne de Crest de la Mission locale Auvergne Rhône-Alpes',
			key: 'shortDesc'
		}
	];
</script>

<script lang="ts">
	export let structure: StructureRequest;
	export let globalError: string | null = '';
	export let fieldErrors: StructureRequest;
	export let confirmText = 'Confirmer';
	export let onInput = undefined;
	export let onCancel: () => void | null = null;
	export let disabledKeys: Record<InputItem['key'], boolean> = {};
	export let structureId: string | null = null;

	let originalStructure = { ...structure };

	$: untouched = deepEqual(structure, originalStructure);
	$: isValid = validateStructure(structure);

	const dispatch = createEventDispatcher();

	function validateStructure(_struct: StructureRequest) {
		return true;
	}

	async function handleSubmit() {
		if (structureId) {
			mutation(operationStore(UpdateStructureDocument))({ ...structure, id: structureId });
		} else {
			mutation(operationStore(InsertStructureDocument))({ ...structure });
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
	<h2 class="bf-500 fr-h4 pt-8 px-8">
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
			/>
		{/each}
		{#if globalError}
			<div class="text-error">{globalError}</div>
		{/if}
		<div class="flex flex-row gap-2 mt-12">
			<Button type="submit" disabled={isValid || untouched}>{confirmText}</Button>
			<Button outline={true} on:click={handleCancel}>Annuler</Button>
		</div>
	</form>
</div>

<style lang="postcss">
	.text-error {
		color: var(--error);
	}
</style>
