<script context="module">
	let counter = 0;
</script>

<script lang="ts">
	import type { Option, SvelteEventHandler } from '$lib/types';
	import { createEventDispatcher } from 'svelte';

	export let selected: string | null;
	export let options: Option[];
	export let caption: string | null = null;
	export let ariaControls: string | null = null;
	export let legendClass = '';
	export let error: string | null = '';

	const dispatch = createEventDispatcher();

	const handleInput: SvelteEventHandler<HTMLInputElement> = (event) => {
		dispatch('input', { value: event.currentTarget.value });
	};

	counter += 1;

	export let name = `radio-group`;

	$: groupId = `${name}-${counter}`;

	$: roleProp = error ? { role: 'group' } : {};
</script>

<div class="fr-form-group">
	<fieldset
		class="fr-fieldset"
		class:fr-fieldset--error={error}
		{...roleProp}
		aria-labelledby={`${groupId}-radio-legend`}
	>
		<legend
			class="fr-fieldset__legend fr-text--regular"
			id={`${groupId}-radio-legend ${error ? `${groupId}-error-messages` : ''}`}
		>
			{#if caption}
				<span class={legendClass}>
					{caption}
				</span>
			{/if}
		</legend>
		<div class="fr-fieldset__content my-4">
			{#each options as option (option.name)}
				<div class="fr-radio-group">
					<input
						on:change={handleInput}
						type="radio"
						id="radio-{option.name}"
						name={groupId}
						bind:group={selected}
						value={option.name}
						aria-controls={ariaControls}
					/>
					<label class="fr-label" for="radio-{option.name}">{@html option.label}</label>
				</div>
			{/each}
		</div>
		{#if error}
			<div class="fr-messages-group" id={`${groupId}-error-messages`} aria-live="assertive">
				<p class="fr-message fr-message--error" id={`${groupId}-error-message-error`}>{error}</p>
			</div>
		{/if}
	</fieldset>
</div>
