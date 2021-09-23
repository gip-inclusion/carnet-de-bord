<script context="module" lang="ts">
	import type { AccountRequest, InputItem } from '$lib/types';
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
			label: 'Adresse de courriel',
			hint: 'Ex : jb@poquelin.fr',
			key: 'email',
			type: 'email',
			required: true,
		},
		{
			label: 'Nom',
			hint: 'Ex : Poquelin',
			key: 'firstname',
		},
		{
			label: 'Prénom',
			hint: 'Ex : Jean-Baptiste',
			key: 'lastname',
		},
		{
			label: 'Téléphone',
			hint: 'Ex : 0123456789',
			key: 'mobileNumber',
		},
		{
			label: 'Fonction',
			hint: 'Ex : Conseiller en réinsertion',
			key: 'position',
		},
	];

	export let account: AccountRequest;
	export let globalError: string | null = '';
	export let fieldErrors: AccountRequest;
	export let disabled: boolean;
	export let confirmText = 'Confirmer';
	export let onInput = undefined;
	export let disabledKeys: Record<InputItem['key'], boolean> = {};

	let originalAccount = { ...account };

	$: untouched = deepEqual(account, originalAccount);
</script>

<form on:submit|preventDefault={handleSubmit}>
	{#each inputs as input (input.key)}
		<Input
			bind:val={account[input.key]}
			inputHint={input.hint}
			inputLabel={input.label}
			error={fieldErrors[input.key]}
			on:input={onInput}
			disabled={disabledKeys[input.key]}
			type={input.type}
			required={input.required}
		/>
	{/each}
	{#if globalError}
		<div class="text-error">{globalError}</div>
	{/if}
	<div class="flex flex-row gap-6 mt-12">
		<Button type="submit" disabled={disabled || untouched}>{confirmText}</Button>
		<Button outline={true} on:click={handleCancel}>Annuler</Button>
	</div>
</form>

<style lang="postcss">
	.text-error {
		color: var(--error);
	}
</style>
