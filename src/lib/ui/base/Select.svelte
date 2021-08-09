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
	export let options: Option[];
	export let selected: Option | null = null;
	export let disabled: boolean | null = false;

	const dispatch = createEventDispatcher();
	async function handleSelect() {
		dispatch('select', { selected });
	}
</script>

<div {id}>
	<!-- @TODO non-standard, DSFR deems the label mandatory -->
	{#if selectLabel}
		<label class="fr-label" for="select">{selectLabel}</label>
	{/if}
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
			<option value={option.name}>{option.label}</option>
		{/each}
	</select>
</div>
