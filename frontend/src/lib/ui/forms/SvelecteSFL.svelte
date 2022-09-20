<script context="module" lang="ts">
	let counter = 0;
</script>

<script lang="ts">
	import { getContext } from 'svelte';
	import { key, FormProps } from 'svelte-forms-lib';
	import Svelecte, { config } from 'svelecte';
	import type { Writable } from 'svelte/store';
	import { pluck } from '$lib/helpers';

	export let name = `svelect-input-${counter}`;
	export let inputId = `svelect-input-${counter}`;
	export let options: unknown[];
	export let placeholder = '';
	export let inputLabel = '';
	export let inputHint: string | null = '';
	export let disabled = false;
	export let required = false;
	export let valid: string | null = '';

	$: svelecteProps = pluck(
		[
			'name',
			'inputId',
			'options',
			'placeholder',
			'inputLabel',
			'inputHint',
			'disabled',
			'required',
			'valid',
			'class',
		],
		$$props
	);

	const { form, errors, isSubmitted } = getContext<
		{ isSubmitted: Writable<boolean> } & FormProps['context']
	>(key);

	function changeHandler(event: CustomEvent<{ value: string }>) {
		if (svelecteProps.valueField) {
			$form[name] = event.detail[svelecteProps.valueField];
		} else {
			$form[name] = event.detail;
		}
	}
	$: hasError = Boolean($errors[name]) && $isSubmitted;
	$: error = $errors[name];

	config.i18n = {
		empty: 'Aucun élément',
		nomatch: 'Aucun élément ne correspond à votre recherche',
		max: (num: number) => `Vous avez choisi le nombre maximum d'éléments (${num})`,
		fetchBefore: 'Commencez à taper pour rechercher',
		fetchEmpty: 'Aucun élément ne correspond à votre recherche',
		collapsedSelection: (count: number) => `${count} élément(s) sélectionné(s)`,
	};
</script>

<div
	class={`fr-input-group ${hasError ? 'fr-input-group--error' : ''} ${svelecteProps.class || ''}`}
>
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
			{name}
			{inputId}
			{...svelecteProps}
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
