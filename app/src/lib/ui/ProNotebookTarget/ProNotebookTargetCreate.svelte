<script lang="ts">
	import { Button, Radio, Select } from '$lib/ui/base';
	import { contractTypeFullKeys } from '$lib/constants/keys';
	import { createEventDispatcher } from 'svelte';
	import type { AddTargetPayload, Target } from '.';

	export let targets: Target[] = [];

	const formData: AddTargetPayload = {
		target: null,
		linkedTo: null,
	};

	const dispatch = createEventDispatcher<{ 'create-target': AddTargetPayload; cancel: unknown }>();

	$: targetOptions =
		targets.map(({ description, refTheme }) => ({
			label: description,
			name: description,
			group: refTheme.label,
		})) || [];

	$: disabled = !formData.target || !formData.linkedTo;

	function onAddTarget() {
		dispatch('create-target', formData);
	}
	function onCancel() {
		dispatch('cancel');
	}
</script>

<div class="min-w-0">
	<Select
		name="objectif"
		selectLabel={'Objectif'}
		options={targetOptions}
		bind:selected={formData.target}
		groupOption
	/>
</div>
<Radio
	caption={'Veuillez sélectionner le type de contrat lié à cet objectif.'}
	bind:selected={formData.linkedTo}
	options={contractTypeFullKeys.options}
	name="contrat"
/>

<div class="flex flex-row gap-6 pt-4 pb-12">
	<Button title="Ajouter" {disabled} on:click={onAddTarget}>Ajouter</Button>
	<Button title="Annuler" outline={true} on:click={onCancel}>Annuler</Button>
</div>
