<script context="module" lang="ts">
	let counter = 0;
</script>

<script lang="ts">
	import { pluck } from '$lib/helpers';
	import type { Option, SvelteEventHandler } from '$lib/types';
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
	export let groupOption = false;

	const dispatch = createEventDispatcher();
	const handleSelect: SvelteEventHandler<HTMLSelectElement> = async function handleSelect(event) {
		selected = event.currentTarget.value;
		name = event.currentTarget.name;
		dispatch('select', { name, selected });
	};

	function groupByHandler(acc: { label: string; items: Option[] }[], item: Option) {
		const optgroup = acc.find((obj) => obj.label === item.group);

		if (optgroup) {
			optgroup.items.push(item);
		} else {
			acc.push({ label: item.group, items: [item] });
		}
		return acc;
	}

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
		{#if groupOption}
			{@const groupedOptions = options.reduce(groupByHandler, [])}
			{#each groupedOptions as optionGroup}
				<optgroup label={optionGroup.label}>
					{#each optionGroup.items as option}
						<option value={option.name}>{option.label}</option>
					{/each}
				</optgroup>
			{/each}
		{:else}
			{#each options as option (option.name)}
				<option value={option.name}>{option.label}</option>
			{/each}
		{/if}
	</select>

	{#if error}
		<p id={`select-error-desc-error-${id}`} class="fr-error-text" aria-live="assertive">
			{error}
		</p>
	{/if}
	{#if valid}
		<p id={`select-valid-desc-valid-${id}`} class="fr-valid-text" aria-live="assertive">
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
