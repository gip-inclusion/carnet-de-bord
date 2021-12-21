<script context="module" lang="ts">
	let counter = 0;
</script>

<script lang="ts">
	import { getContext } from 'svelte';
	import { key } from 'svelte-forms-lib';
	import Svelecte from 'svelecte';

	export let name = `svelect-input-${counter}`;
	export let id = `svelect-input-${counter}`;
	export let options: unknown[];
	export let placeholder = '';
	export let inputLabel = '';
	export let inputHint: string | null = '';
	export let disabled = false;
	export let required = false;
	export let valid: string | null = '';

	const { form, errors, isSubmitted } = getContext(key);
	console.log('render', name, form[name], options);

	function changeHandler(e) {
		console.log('change', $$props, $$props.valueField, e.detail[$$props.valueField]);
		if ($$props.valueField) {
			$form[name] = e.detail[$$props.valueField];
		} else {
			$form[name] = e.detail;
		}
	}
	$: hasError = Boolean($errors[name]) && $isSubmitted;
	$: error = $errors[name];
</script>

<div class={`fr-input-group ${hasError ? 'fr-input-group--error' : ''} ${$$props.class}`}>
	<label class="fr-label flex-grow" for={name}>
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
			{id}
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
