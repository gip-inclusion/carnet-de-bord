<script lang="ts">
	import type { Option } from '$lib/types';
	export let option: Option;
	export let disabled = false;
	export let additionalLabel: string | null = null;
	export let boxError: string | null = null;
	export let boxSuccess: string | null = null;
	export let groupId: string;
	export let classNames = '';
	export let title = '';
	export let selectedOptions: string[] | null;

	let input: HTMLElement;

	// we're manually handling this instead of using bind because of this: https://github.com/sveltejs/svelte/issues/2308
	// solution lifted from https://svelte.dev/repl/02d60142a1cc470bb43e0cfddaba4af1
	function onChange({ target }) {
		const { value, checked } = target;
		if (checked) {
			selectedOptions = [...selectedOptions, value];
		} else {
			selectedOptions = selectedOptions.filter((item) => item !== value);
		}
	}
</script>

<div class={`fr-checkbox-group ${classNames}`} on:click={input.click}>
	<input
		bind:this={input}
		type="checkbox"
		id="checkbox-{groupId}-{option.name}"
		name="checkbox-{groupId}"
		checked={selectedOptions.includes(option.name)}
		value={option.name}
		{disabled}
		on:change={onChange}
		{title}
	/>
	<label class="fr-label" for="checkbox-{groupId}-{option.name}">
		{option.label}
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
