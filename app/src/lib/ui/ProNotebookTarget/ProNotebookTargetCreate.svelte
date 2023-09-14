<script lang="ts">
	import { Button, Radio, Select, Checkbox } from '$lib/ui/base';
	import { contractTypeFullKeys } from '$lib/constants/keys';
	import { createEventDispatcher } from 'svelte';
	import type { AddTargetPayload, Target } from '.';

	export let targets: Target[] = [];

	const formData: AddTargetPayload = {
		target: null,
		linkedTo: null,
		consent: false,
	};

	let submited = false;

	type Errors = Record<keyof typeof formData, string | null>;

	const dispatch = createEventDispatcher<{ 'create-target': AddTargetPayload; cancel: unknown }>();

	$: targetOptions =
		targets.map(({ description, refTheme }) => ({
			label: description,
			name: description,
			group: refTheme.label,
		})) || [];

	function isValid(data: AddTargetPayload): boolean {
		return (
			data.target &&
			data.linkedTo &&
			((data.linkedTo !== 'no' && data.consent) || data.linkedTo === 'no')
		);
	}

	function getErrors(data: AddTargetPayload): Errors {
		if (!submited) {
			return {
				target: null,
				linkedTo: null,
				consent: null,
			};
		}
		const e = {
			target: data.target ? null : 'Ce champ est requis',
			linkedTo: data.linkedTo ? null : 'Ce champ est requis',
			consent:
				data.linkedTo && data.linkedTo !== 'no' && data.consent == false
					? "Le consentement du bénéficiaire est obligatoire lorsque l'objectif est associé à un contrat"
					: null,
		};
		return e;
	}
	$: disabled = submited && !isValid(formData);
	$: errors = submited && getErrors(formData);

	function onAddTarget() {
		submited = true;
		if (isValid(formData)) {
			dispatch('create-target', formData);
		}
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
		error={submited && errors.target}
		on:select={() => getErrors(formData)}
	/>
</div>
<Radio
	caption={'Veuillez sélectionner le type de contrat lié à cet objectif.'}
	bind:selected={formData.linkedTo}
	options={contractTypeFullKeys.options}
	name="contrat"
	error={submited && errors.linkedTo}
	on:input={() => getErrors(formData)}
/>

<Checkbox
	name="consentement"
	bind:checked={formData.consent}
	label="Le bénéficiaire s'engage à la réalisation de cet objectif."
	boxError={submited && errors.consent}
	on:change={() => getErrors(formData)}
/>
<div class="flex flex-row gap-6 pt-4 pb-12">
	<Button title="Ajouter" {disabled} on:click={onAddTarget}>Ajouter</Button>
	<Button title="Annuler" outline={true} on:click={onCancel}>Annuler</Button>
</div>
