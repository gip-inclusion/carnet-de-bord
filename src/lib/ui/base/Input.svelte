<script context="module">
	let counter = 0;
</script>

<script lang="ts">
	import type { InputType } from '$lib/types';

	counter++;

	export let name = `text-input-text-${counter}`;
	export let id: string | null = `text-input-${counter}`;
	export let inputLabel: string | null = '';
	export let inputHint: string | null = '';
	export let placeholder: string | null = '';
	export let value: string | null;
	export let type: InputType = 'text';
	export let required: boolean | null = false;
	export let error: string | null = '';
	export let valid: string | null = '';
	export let disabled: boolean | null = false;
	export let additionnalClasses = '';
</script>

<div
	{id}
	class={`fr-input-group ${error ? 'fr-input-group--error' : ''} ${
		valid ? 'fr-input-group--valid' : ''
	} ${additionnalClasses}`}
>
	<label class="fr-label flex-grow" for={name}>
		<div>{inputLabel}{required ? ' *' : ''}</div>
		{#if inputHint}
			<span
				class="fr-hint-text justify-self-stretch"
				style={/* hack because the DSFR component does not colorize the hint */
				`color: var(--${error ? 'error' : valid ? 'success' : 'g600'});`}
			>
				{inputHint}
			</span>
		{/if}
	</label>
	<!-- https://github.com/sveltejs/svelte/issues/3921 -->
	<div class="justify-self-end">
		{#if type === 'password'}
			<input
				type="password"
				class={`fr-input ${error ? 'fr-input--error' : ''} ${valid ? 'fr-input--valid' : ''}`}
				{placeholder}
				id={name}
				{name}
				{required}
				bind:value
				{disabled}
				on:input
				on:change
				on:keyup
				on:keydown
				on:focus
				on:blur
			/>
		{:else if type === 'email'}
			<input
				type="email"
				class={`fr-input ${error ? 'fr-input--error' : ''} ${valid ? 'fr-input--valid' : ''}`}
				{placeholder}
				id={name}
				{name}
				{required}
				bind:value
				{disabled}
				on:input
				on:change
				on:keyup
				on:keydown
				on:focus
				on:blur
			/>
		{:else if type === 'number'}
			<input
				type="number"
				class={`fr-input ${error ? 'fr-input--error' : ''} ${valid ? 'fr-input--valid' : ''}`}
				{placeholder}
				id={name}
				{name}
				{required}
				bind:value
				{disabled}
				on:input
				on:change
				on:keyup
				on:keydown
				on:focus
				on:blur
			/>
		{:else if type === 'date'}
			<input
				type="date"
				class={`fr-input ${error ? 'fr-input--error' : ''} ${valid ? 'fr-input--valid' : ''}`}
				{placeholder}
				id={name}
				{name}
				{required}
				bind:value
				{disabled}
				on:input
				on:change
				on:keyup
				on:keydown
				on:focus
				on:blur
			/>
		{:else}
			<input
				type="text"
				class={`fr-input ${error ? 'fr-input--error' : ''} ${valid ? 'fr-input--valid' : ''}`}
				{placeholder}
				id={name}
				{name}
				{required}
				bind:value
				{disabled}
				on:input
				on:change
				on:keyup
				on:keydown
				on:focus
				on:blur
			/>
		{/if}
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
