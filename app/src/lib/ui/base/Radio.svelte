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

	const dispatch = createEventDispatcher();

	const handleInput: SvelteEventHandler<HTMLInputElement> = (event) => {
		dispatch('input', { value: event.currentTarget.value });
	};

	counter += 1;

	export let name = `radio-group`;

	$: groupId = `${name}-${counter}`;
</script>

<div class="fr-form-group">
	<fieldset class="fr-fieldset">
		<legend class="fr-fieldset__legend fr-text--regular" id="radio-legend">
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
	</fieldset>
</div>
