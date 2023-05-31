<script lang="ts">
	import type { Option } from '$lib/types';

	import { getContext } from 'svelte';
	import { type FormProps, key } from 'svelte-forms-lib';
	import type { Writable } from 'svelte/store';

	export let name: string;
	export let options: Option[];
	export let legend = '';
	export let legendClass = '';
	export let hint = '';
	export let valid = '';
	export let disabled = false;
	export let required = false;
	export let ariaControls: string | null = null;

	const { form, handleChange, errors, isSubmitted } = getContext<
		{ isSubmitted: Writable<boolean> } & FormProps['context']
	>(key);

	$: hasError = Boolean($errors[name]) && $isSubmitted;
	$: error = $errors[name];
</script>

<div class="fr-form-group">
	<fieldset
		class="fr-fieldset"
		{...(valid || hasError) && {
			role: 'group',
			'aria-labelledby': `radio-${name}-legend radio-${name}-${
				valid ? 'valid' : error ? 'error' : ''
			}`,
		}}
	>
		<legend class={`fr-fieldset__legend fr-text--regular`} id={`radio-${name}-legend `}>
			<span class={legendClass}>
				{legend}
			</span>
			{#if hint} <span class="fr-hint-text">{hint}</span> {/if}
		</legend>
		<div class="fr-fieldset__content">
			{#each options as option}
				<div class="fr-radio-group">
					<input
						type="radio"
						{name}
						{required}
						{disabled}
						id={`radio-${name}-${option.name}`}
						on:change
						on:change={handleChange}
						value={option.name}
						checked={$form[name] === option.name}
						aria-controls={ariaControls}
					/>
					<label class="fr-label" for={`radio-${name}-${option.name}`}>{option.label} </label>
				</div>
			{/each}
		</div>
		{#if hasError && error}
			<p id={`radio-${name}-error`} class="fr-error-text">{error}</p>
		{/if}
		{#if valid}
			<p id={`radio-${name}-valid`} class="fr-valid-text">{valid}</p>
		{/if}
	</fieldset>
</div>
