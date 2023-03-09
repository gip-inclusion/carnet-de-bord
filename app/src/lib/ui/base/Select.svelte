<script context="module" lang="ts">
	import type { Option, SvelteEventHandler } from '$lib/types';

	let counter = 0;
</script>

<script lang="ts">
	import { pluck } from '$lib/helpers';

	import { createEventDispatcher } from 'svelte';

	counter++;
	const uniqueId = `select-input-${counter}`;
	export let name = uniqueId;
	export let id: string | null = uniqueId;
	export let selectHint: string | null = '';
	export let selectLabel: string | null;
	export let additionalLabel: string | null = '';
	export let options: Option[];
	export let selected: string | null = null;
	export let disabled: boolean | null = false;
	export let error: string | null = '';
	export let valid: string | null = '';
	export let required: boolean | null = false;
	export let classNames = '';
	export let twWidthClass = '';

	const dispatch = createEventDispatcher();
	const handleSelect: SvelteEventHandler<HTMLSelectElement> = async function handleSelect(event) {
		selected = event.currentTarget.value;
		name = event.currentTarget.name;
		dispatch('select', { name, selected });
	};

	const selectHintOption = 'select_hint_option';
	$: selectProps = pluck(
		[
			'options',
			'additionnalLabel',
			'selectHint',
			'selectLabel',
			'selected',
			'error',
			'valid',
			'class',
		],
		$$props
	);
</script>

<div
	{id}
	class={`fr-select-group ${error ? 'fr-select-group--error' : ''} ${
		valid ? 'fr-select-group--valid' : ''
	} ${twWidthClass} ${classNames}`}
>
	<!-- @TODO non-standard, DSFR deems the label mandatory -->
	{#if selectLabel}
		<label class="fr-label" for={id}>
			{selectLabel}{required ? ' *' : ''}
			{#if additionalLabel}
				<span class="fr-hint-text">
					{@html additionalLabel}
				</span>
			{/if}
		</label>
	{/if}
	<select
		class={`fr-select ${error ? 'fr-select--error' : ''} ${valid ? 'fr-select--valid' : ''}`}
		aria-describedby={`${error ? `select-error-desc-error-${id}` : ''} ${
			valid ? `select-valid-desc-valid-${id}` : ''
		}`}
		value={selected || selectHintOption}
		{id}
		{name}
		on:change={handleSelect}
		on:change
		{disabled}
		{...selectProps}
	>
		<option value={selectHintOption} disabled>{selectHint || 'Sélectionner...'}</option>
		{#each options as option (option.name)}
			<option value={option.name}>{option.label}</option>
		{/each}
	</select>

	{#if error}
		<p id={`select-error-desc-error-${id}`} class="fr-error-text" role="status">
			{error}
		</p>
	{/if}
	{#if valid}
		<p id={`select-valid-desc-valid-${id}`} class="fr-valid-text" role="status">
			{valid}
		</p>
	{/if}
</div>

<style>
	.no-label .fr-label {
		display: none;
	}
	.no-label .fr-label + .fr-select {
		margin: 0;
	}
</style>
