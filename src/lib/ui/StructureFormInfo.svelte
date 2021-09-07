<script context="module" lang="ts">
	import type { StructureRequest, InputItem } from '$lib/types';
	import { Button, Input } from '$lib/ui/base';
	import { default as deepEqual } from 'fast-deep-equal';
	import { createEventDispatcher } from 'svelte';
</script>

<script lang="ts">
	const dispatch = createEventDispatcher();
	async function handleSubmit() {
		dispatch('submit', {});
	}

	async function handleCancel() {
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
		}
	];

	export let structure: StructureRequest;
	export let globalError: string | null = '';
	export let fieldErrors: StructureRequest;
	export let disabled: boolean;
	export let confirmText = 'Confirmer';
	export let onInput = undefined;
	export let disabledKeys: Record<InputItem['key'], boolean> = {};

	let originalStructure = { ...structure };

	$: untouched = deepEqual(structure, originalStructure);
</script>

<form on:submit|preventDefault={handleSubmit}>
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

<style lang="postcss">
	.text-error {
		color: var(--error);
	}
</style>
