<script context="module" lang="ts">
	let uniqueId = 0;
</script>

<script lang="ts">
	import { getContext } from 'svelte';
	import { FormProps, key } from 'svelte-forms-lib';
	import type { Writable } from 'svelte/store';

	uniqueId += 1;

	export let id = `$checkbox-sfl-${uniqueId}`;
	export let name: string;
	export let label: string;
	export let additionalLabel: string | null = null;
	export let valid = '';
	export let disabled = false;
	export let required = false;

	const { form, handleChange, errors, isSubmitted } = getContext<
		{ isSubmitted: Writable<boolean> } & FormProps['context']
	>(key);

	$: hasError = Boolean($errors[name]) && $isSubmitted;
	$: error = $errors[name];
</script>

<div class={`fr-checkbox-group`}>
	<input
		type="checkbox"
		on:change
		on:change={handleChange}
		{disabled}
		{required}
		checked={$form[name] === true}
		id={name}
		{name}
	/>
	<label class="fr-label" for={name}>
		{label}
		{#if additionalLabel}
			<span class="fr-hint-text">{additionalLabel}</span>
		{/if}
	</label>
	{#if hasError && error}
		<p id={`${id}-error-desc-valid`} class="fr-error-text">
			{error}
		</p>
	{/if}
	{#if valid}
		<p id={`${id}-valid-desc-valid`} class="fr-valid-text">
			{valid}
		</p>
	{/if}
</div>
