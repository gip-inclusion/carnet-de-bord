<script context="module">
	let counter = 0;
</script>

<script lang="ts">
	import type { Option } from '$lib/types';
	import Checkbox from '$lib/ui/base/GroupCheckbox.svelte';
	export let selectedOptions: string[] | null;
	export let options: Option[];
	export let caption: string | null = null;
	export let secondaryCaption: string | null = null;
	export let disabled = false;
	export let disabledBoxes: Record<string, boolean> = {};
	export let additionalLabels: Record<string, string> = {};
	export let inline = false;
	export let globalSuccess: string | null = null;
	export let globalError: string | null = null;
	export let boxesErrors: Record<string, string> = {};
	export let boxesSuccesses: Record<string, string> = {};
	export let globalClassNames = '';
	export let checkboxesClassNames: Record<string, string> = {};
	export let checkboxesCommonClassesNames = '';

	counter += 1;

	export let name = `radio-group`;

	$: groupId = `${name}-${counter}`;
</script>

<div class={'fr-form-group'}>
	<fieldset
		class={`fr-fieldset
		${inline ? 'fr-fieldset--inline' : ''}
		${globalError ? 'fr-fieldset--error' : ''}
		${globalSuccess ? 'fr-fieldset--valid' : ''}`}
		role="group"
		aria-labelledby={`
		${globalError ? 'checkboxes-error-legend checkboxes-error-desc-error' : ''}
		${globalSuccess ? 'checkboxes-success-legend checkboxes-success-desc-success' : ''}
		`}
		{disabled}
	>
		{#if caption}
			<legend class="fr-fieldset__legend fr-text--regular" id={`checkboxes-${groupId}-legend`}>
				{caption}
				{#if secondaryCaption}
					<span class="fr-hint-text">{secondaryCaption}</span>
				{/if}
			</legend>
		{/if}
		<div class={`fr-fieldset__content ${globalClassNames}`}>
			{#each options as option (option.name)}
				<Checkbox
					bind:selectedOptions
					{option}
					{groupId}
					disabled={disabledBoxes[option.name]}
					additionalLabel={additionalLabels[option.name]}
					boxError={boxesErrors[option.name]}
					boxSuccess={boxesSuccesses[option.name]}
					classNames={`${checkboxesClassNames[option.name] || ''} ${
						checkboxesCommonClassesNames || ''
					}`}
				/>
			{/each}
		</div>
	</fieldset>
</div>
