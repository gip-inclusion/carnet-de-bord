<script context="module">
	let counter = 0;
</script>

<script lang="ts">
	import type { Option } from '$lib/types';
	export let selected: string | null;
	export let options: Option[];
	export let caption: string;
	export let legendClass = '';

	counter += 1;

	export let name = `radio-group`;

	$: groupId = `${name}-${counter}`;
</script>

<div class="fr-form-group">
	<fieldset class="fr-fieldset">
		<legend class="fr-fieldset__legend fr-text--regular" id="radio-legend">
			<span class={legendClass}>
				{caption}
			</span>
		</legend>
		<div class="fr-fieldset__content">
			{#each options as option (option.name)}
				<div class="fr-radio-group">
					<input
						type="radio"
						id="radio-{option.name}"
						name={groupId}
						bind:group={selected}
						value={option.name}
					/>
					<label class="fr-label" for="radio-{option.name}">{option.label}</label>
				</div>
			{/each}
		</div>
	</fieldset>
</div>
