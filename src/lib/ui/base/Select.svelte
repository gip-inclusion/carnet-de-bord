<script context="module" lang="ts">
	import type { Option } from '$lib/ui/base/types';

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
	export let selected: Option | null = null;
	export let selectedMultiple: Option[] | null = null;
	export let disabled: boolean | null = false;
	export let multiple: boolean | null = false;

	const dispatch = createEventDispatcher();
	async function handleSelect() {
		dispatch('select', { selected: multiple ? selectedMultiple : selected });
	}
</script>

<div {id} class="fr-input-group">
	<!-- @TODO non-standard, DSFR deems the label mandatory -->
	{#if selectLabel}
		<label class="fr-label" for={uniqueId}>
			{selectLabel}
			{#if additionalLabel}
				<span class="fr-hint-text">
					{additionalLabel}
				</span>
			{/if}
		</label>
	{/if}
	{#if multiple}
		<select
			class="fr-select"
			bind:value={selectedMultiple}
			id={uniqueId}
			name={uniqueId}
			on:change={handleSelect}
			{disabled}
			multiple
		>
			{#if selectHint}
				<option value="" selected disabled hidden>{selectHint}</option>
			{/if}
			{#each options as option (option.name)}
				<option name={option.name} value={option}>{option.label}</option>
			{/each}
		</select>
	{:else}
		<select
			class="fr-select"
			bind:value={selected}
			id={uniqueId}
			name={uniqueId}
			on:change={handleSelect}
			{disabled}
		>
			{#if selectHint}
				<option value="" selected disabled hidden>{selectHint}</option>
			{/if}
			{#each options as option (option.name)}
				<option name={option.name} value={option}>{option.label}</option>
			{/each}
		</select>
	{/if}
</div>
