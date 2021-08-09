<script context="module">
	let counter = 0;
</script>

<script lang="ts">
	counter++;
	let uniqueId = `text-input-text-${counter}`;
	export let id: string | null = `text-input-${counter}`;
	export let inputLabel: string | null = '';
	export let additionalLabel: string | null = '';
	export let inputHint: string | null = '';
	export let val: string | null;
	export let required: boolean | null = false;
	export let error: string | null = '';
	export let valid: string | null = '';
</script>

<div
	{id}
	class={`fr-input-group ${error ? 'fr-input-group--error' : ''} ${
		valid ? 'fr-input-group--valid' : ''
	}`}
>
	<label class="fr-label" for={uniqueId}>
		{inputLabel}
		{#if additionalLabel}
			<span
				class="fr-hint-text"
				style={/* hack because the DSFR component does not colorize the hint */
				`color: var(--${error ? 'error' : valid ? 'success' : 'g600'});`}
			>
				{additionalLabel}
			</span>
		{/if}
	</label>
	<input
		class="fr-input"
		type="text"
		placeholder={inputHint}
		id={uniqueId}
		name={uniqueId}
		{required}
		bind:value={val}
	/>
	{#if error}
		<p id="text-input-error-desc-error" class="fr-error-text">{error}</p>
	{/if}
	{#if valid}
		<p id="text-input-valid-desc-valid" class="fr-valid-text">{valid}</p>
	{/if}
</div>
