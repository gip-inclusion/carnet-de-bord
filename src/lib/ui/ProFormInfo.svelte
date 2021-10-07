<script context="module" lang="ts">
	import type { AccountRequest, InputItem } from '$lib/types';
	import { Button, Input } from '$lib/ui/base';
	import { createEventDispatcher } from 'svelte';
</script>

<script lang="ts">
	const dispatch = createEventDispatcher();

	async function handleCancel() {
		dispatch('cancel', {});
	}

	export let account: AccountRequest;
	export let globalError: string | null = '';
	export let fieldErrors: AccountRequest;
	export let disabled: boolean;
	export let confirmText = 'Confirmer';
	export let onInput = undefined;
	export let disabledKeys: Record<InputItem['key'], boolean> = {};

	async function handleSubmit() {
		dispatch('submit', { account });
	}
</script>

<form on:submit|preventDefault={handleSubmit}>
	{#if account}
		<Input
			bind:val={account['email']}
			inputHint={'Ex : jb@poquelin.fr'}
			inputLabel={'Courriel'}
			error={fieldErrors['email']}
			on:input={onInput}
			disabled={disabledKeys['email']}
			type={'email'}
			required={true}
		/>
		<Input
			bind:val={account['firstname']}
			inputHint={'Ex : Poquelin'}
			inputLabel={'Nom'}
			error={fieldErrors['firstname']}
			on:input={onInput}
			disabled={disabledKeys['firstname']}
		/>
		<Input
			bind:val={account['lastname']}
			inputHint={'Ex : Jean-Baptiste'}
			inputLabel={'Prénom'}
			error={fieldErrors['lastname']}
			on:input={onInput}
			disabled={disabledKeys['lastname']}
		/>
		<Input
			bind:val={account['mobileNumber']}
			inputHint={'Ex : 0123456789'}
			inputLabel={'Téléphone'}
			error={fieldErrors['mobileNumber']}
			on:input={onInput}
			disabled={disabledKeys['mobileNumber']}
		/>
		<Input
			bind:val={account['position']}
			inputHint={'Ex : Conseiller en réinsertion'}
			inputLabel={'Fonction'}
			error={fieldErrors['position']}
			on:input={onInput}
			disabled={disabledKeys['position']}
		/>
		{#if globalError}
			<div class="text-error">{globalError}</div>
		{/if}
		<div class="flex flex-row gap-6 mt-12">
			<Button type="submit" {disabled}>{confirmText}</Button>
			<Button outline={true} on:click={handleCancel}>Annuler</Button>
		</div>
	{/if}
</form>

<style lang="postcss">
	.text-error {
		color: var(--error);
	}
</style>
