<script context="module">
	let counter = 0;
</script>

<script lang="ts">
	import type { InputType, SvelteEventHandler } from '$lib/types';

	counter++;
	let uniqueId = `text-input-text-${counter}`;
	export let id: string | null = `text-input-${counter}`;
	export let inputLabel: string | null = '';
	export let additionalLabel: string | null = '';
	export let inputHint: string | null = '';
	export let val: string | null;
	export let type: InputType = 'text';
	export let required: boolean | null = false;
	export let error: string | null = '';
	export let valid: string | null = '';
	export let disabled: boolean | null = false;

	import { createEventDispatcher } from 'svelte';
	const dispatch = createEventDispatcher();
	const handleInput: SvelteEventHandler<HTMLInputElement> = (event) => {
		dispatch('input', { value: event.currentTarget.value });
	};
</script>

<div
	{id}
	class={`flex h-full flex-col fr-input-group ${error ? 'fr-input-group--error' : ''} ${
		valid ? 'fr-input-group--valid' : ''
	}`}
>
	<label class="fr-label flex-grow" for={uniqueId}>
		<div>{inputLabel}{required ? '*' : ''}</div>
		{#if additionalLabel}
			<span
				class="fr-hint-text justify-self-stretch"
				style={/* hack because the DSFR component does not colorize the hint */
				`color: var(--${error ? 'error' : valid ? 'success' : 'g600'});`}
			>
				{additionalLabel}
			</span>
		{/if}
	</label>
	<!-- https://github.com/sveltejs/svelte/issues/3921 -->
	<div class="justify-self-end">
		{#if type === 'text'}
			<input
				type="text"
				on:input={handleInput}
				class="fr-input"
				placeholder={inputHint}
				id={uniqueId}
				name={uniqueId}
				{required}
				bind:value={val}
				{disabled}
			/>
		{:else if type === 'password'}
			<input
				type="password"
				on:input={handleInput}
				class="fr-input"
				placeholder={inputHint}
				id={uniqueId}
				name={uniqueId}
				{required}
				bind:value={val}
				{disabled}
			/>
		{:else if type === 'number'}
			<input
				type="number"
				on:input={handleInput}
				class="fr-input"
				placeholder={inputHint}
				id={uniqueId}
				name={uniqueId}
				{required}
				bind:value={val}
				{disabled}
			/>
		{:else if type === 'email'}
			<input
				type="email"
				on:input={handleInput}
				class="fr-input"
				placeholder={inputHint}
				id={uniqueId}
				name={uniqueId}
				{required}
				bind:value={val}
				{disabled}
			/>
		{:else if type === 'date'}
			<input
				type="date"
				on:input={handleInput}
				class="fr-input"
				placeholder={inputHint}
				id={uniqueId}
				name={uniqueId}
				{required}
				bind:value={val}
				{disabled}
			/>
		{/if}
	</div>

	{#if error}
		<p id={`text-input-error-desc-error-${uniqueId}`} class="fr-error-text" role="status">
			{error}
		</p>
	{/if}
	{#if valid}
		<p id={`text-input-valid-desc-valid-${uniqueId}`} class="fr-valid-text" role="status">
			{valid}
		</p>
	{/if}
</div>
