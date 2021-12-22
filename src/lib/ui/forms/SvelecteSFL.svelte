<script context="module" lang="ts">
	let counter = 0;
</script>

<script lang="ts">
	import { getContext } from 'svelte';
	import { key, FormProps } from 'svelte-forms-lib';
	import Svelecte from 'svelecte';
	import type { Writable } from 'svelte/store';

	export let name = `svelect-input-${counter}`;
	export let inputId = `svelect-input-${counter}`;
	export let options: unknown[];
	export let placeholder = '';
	export let inputLabel = '';
	export let inputHint: string | null = '';
	export let disabled = false;
	export let required = false;
	export let valid: string | null = '';

	const { form, errors, isSubmitted } = getContext<
		{ isSubmitted: Writable<boolean> } & FormProps['context']
	>(key);

	function changeHandler(event: CustomEvent<{ value: string }>) {
		if ($$props.valueField) {
			$form[name] = event.detail[$$props.valueField];
		} else {
			$form[name] = event.detail;
		}
	}
	$: hasError = Boolean($errors[name]) && $isSubmitted;
	$: error = $errors[name];
</script>

<div class={`fr-input-group ${hasError ? 'fr-input-group--error' : ''} ${$$props.class}`}>
	<label class="fr-label flex-grow" for={inputId}>
		<div>{inputLabel}{required ? ' *' : ''}</div>
		{#if inputHint}
			<span
				class="fr-hint-text justify-self-stretch"
				style={/* hack because the DSFR component does not colorize the hint */
				`color: var(--${error ? 'error' : valid ? 'success' : 'g600'});`}
			>
				{@html inputHint}
			</span>
		{/if}
	</label>
	<div class="justify-self-end">
		<Svelecte
			class="svelecte-control custom-svelecte"
			on:change={changeHandler}
			bind:value={$form[name]}
			{disabled}
			{placeholder}
			{options}
			{...$$props}
		/>
	</div>
	{#if error}
		<p id={`text-input-error-desc-error-${name}`} class="fr-error-text" role="status">
			{error}
		</p>
	{/if}
	{#if valid}
		<p id={`text-input-valid-desc-valid-${name}`} class="fr-valid-text" role="status">
			{valid}
		</p>
	{/if}
</div>
