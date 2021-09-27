<script context="module" lang="ts">
	import type { Option, SvelteEventHandler } from '$lib/types';

	let counter = 0;
</script>

<script lang="ts">
	import { createEventDispatcher } from 'svelte';

	counter++;
	let uniqueId = `select-input-${counter}`;
	export let id: string | null = `select-${counter}`;
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
		dispatch('select', { selected });
	};

	const selectHintOption = 'select_hint_option';
</script>

<div
	{id}
	class={`fr-select-group ${error ? 'fr-select-group--error' : ''} ${
		valid ? 'fr-select-group--valid' : ''
	} ${twWidthClass} ${classNames}`}
>
	<!-- @TODO non-standard, DSFR deems the label mandatory -->
	{#if selectLabel}
		<label class="fr-label" for={uniqueId}>
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
		aria-describedby={`${error ? `select-error-desc-error-${uniqueId}` : ''} ${
			valid ? `select-valid-desc-valid-${uniqueId}` : ''
		}`}
		value={selected || selectHintOption}
		id={uniqueId}
		name={uniqueId}
		on:change={handleSelect}
		{disabled}
	>
		<option value={selectHintOption} disabled>{selectHint || 'Sélectionner...'}</option>
		{#each options as option (option.name)}
			<option name={option.name} value={option.name}>{option.label}</option>
		{/each}
	</select>

	{#if error}
		<p id={`select-error-desc-error-${uniqueId}`} class="fr-error-text" role="status">
			{error}
		</p>
	{/if}
	{#if valid}
		<p id={`select-valid-desc-valid-${uniqueId}`} class="fr-valid-text" role="status">
			{valid}
		</p>
	{/if}
</div>
