<script lang="ts">
	import { pluck } from '$lib/helpers';

	export let name: string;
	export let label: string;
	export let placeholder: string;
	export let hint: string = null;
	export let text = '';
	export let required = false;
	export let disabled = false;
	export let error: string | null = null;
	export let valid: string | null = null;
	$: inputProps = pluck(['label', 'hint', 'value', 'error', 'valid', 'class'], $$props);
</script>

<div
	class={`fr-input-group ${$$props.class || ''}`}
	class:fr-input-group--error={error}
	class:fr-input-group--valid={valid}
>
	<label class="fr-label" for={name}>
		{label}{required ? ' *' : ''}
		{#if hint}
			<span class="fr-hint-text">
				{hint}
			</span>
		{/if}
	</label>

	<textarea
		class:fr-input--error={error}
		class:fr-input--valid={valid}
		class="fr-input"
		{placeholder}
		id={name}
		{name}
		{required}
		{disabled}
		on:input
		on:change
		on:keyup
		on:keydown
		on:focus
		on:blur
		{...inputProps}>{text}</textarea
	>

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
