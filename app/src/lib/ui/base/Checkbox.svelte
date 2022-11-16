<script lang="ts">
	import type { SvelteEventHandler } from '$lib/types';
	import { createEventDispatcher } from 'svelte';

	export let disabled = false;
	export let checked: boolean | null = false;
	export let name: string;
	export let label: string;
	export let additionalLabel: string | null = null;
	export let boxError: string | null = null;
	export let boxSuccess: string | null = null;
	export let classNames = '';

	const dispatch = createEventDispatcher();
	const handleChange: SvelteEventHandler<HTMLInputElement> = (event) => {
		checked = event.currentTarget.checked;
		name = event.currentTarget.name;
		dispatch('change', { name, checked });
	};
</script>

<div class={`fr-checkbox-group ${classNames}`}>
	<input type="checkbox" bind:checked on:change={handleChange} {disabled} id={name} {name} />
	<label class="fr-label" for={name}>
		{label}
		{#if additionalLabel}
			<span class="fr-hint-text">{additionalLabel}</span>
		{/if}
	</label>
	{#if boxError}
		<p id="checkbox-error-desc-error" class="fr-error-text">
			{boxError}
		</p>
	{/if}
	{#if boxSuccess}
		<p id="checkbox-valid-desc-valid" class="fr-valid-text">
			{boxSuccess}
		</p>
	{/if}
</div>
