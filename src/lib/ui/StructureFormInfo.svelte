<script context="module" lang="ts">
	import type { StructureRequest, InputItem } from '$lib/types';
	import { Button, Input } from '$lib/ui/base';
	import { default as deepEqual } from 'fast-deep-equal';
	import { createEventDispatcher } from 'svelte';
</script>

<script lang="ts">
	export let onCancel: () => void | null = null;

	const dispatch = createEventDispatcher();
	async function handleSubmit() {
		dispatch('submit', {});
	}

	async function handleCancel() {
		if (onCancel) {
			onCancel();
		}
		dispatch('cancel', {});
	}

	let inputs: InputItem[] = [
		{
			label: 'Nom',
			hint: 'Ex : Mission locale de Crest',
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

	export let structure: StructureRequest;
	export let globalError: string | null = '';
	export let fieldErrors: StructureRequest;
	export let disabled: boolean;
	export let confirmText = 'Confirmer';
	export let onInput = undefined;
	export let disabledKeys: Record<InputItem['key'], boolean> = {};
	let isNew = Object.keys(structure).length === 0;

	let originalStructure = { ...structure };

	$: untouched = deepEqual(structure, originalStructure);
</script>

<div class="w-full">
	<h2 class="bf-500 fr-h4 pt-8 px-8">{isNew ? 'Création' : 'Modification'} d'une structure</h2>
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
			<Button type="submit" disabled={disabled || untouched}>{confirmText}</Button>
			<Button outline={true} on:click={handleCancel}>Annuler</Button>
		</div>
	</form>
</div>

<style lang="postcss">
	.text-error {
		color: var(--error);
	}
</style>
