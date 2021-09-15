<script lang="ts">
	export let disabled = false;
	export let value = false;
	export let name: string;
	export let label: string;
	export let additionalLabel: string | null = null;
	export let boxError: string | null = null;
	export let boxSuccess: string | null = null;
	export let classNames = '';

	let input: HTMLElement;

	// we're manually handling this instead of using bind because of this: https://github.com/sveltejs/svelte/issues/2308
	// solution lifted from https://svelte.dev/repl/02d60142a1cc470bb43e0cfddaba4af1
	function onChange({ target }) {
		const { checked } = target;
		console.log(label);
		value = checked;
	}
</script>

<div class={`fr-checkbox-group ${classNames}`} on:click={input.click}>
	<input
		bind:this={input}
		type="checkbox"
		checked={value}
		{disabled}
		id={name}
		on:change={onChange}
	/>
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
