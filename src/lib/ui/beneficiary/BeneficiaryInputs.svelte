<script context="module" lang="ts">
	import type { InputType } from '$lib/types';
	import { Input, Select } from '$lib/ui/base';
	import type { BeneficiaryAccount } from '$lib/types';
	import {
		cerObjectLabelValue,
		rightLabelValue,
		workSituationLabelValue
	} from '$lib/constants/LabelValues';
</script>

<script lang="ts">
	let inputs: { label: string; hint: string; type?: InputType; key: keyof BeneficiaryAccount }[] = [
		{
			label: 'Nom',
			hint: 'Ex : Poquelin',
			key: 'firstname'
		},
		{
			label: 'Prénom',
			hint: 'Ex : Jean-Baptiste',
			key: 'lastname'
		},
		{
			label: 'Date de naissance (JJ/MM/AAAA)',
			hint: 'Ex : 21/12/1977',
			key: 'dateOfBirth'
		},
		{
			label: 'Téléphone',
			hint: 'Ex : 0123456789',
			key: 'mobileNumber'
		},
		{
			label: 'Adresse de courriel',
			hint: 'Ex : jb@poquelin.fr',
			key: 'email',
			type: 'email'
		},
		{
			label: 'Adresse',
			hint: 'Ex : 55-57 rue du Faubourg Saint-Honoré',
			key: 'address1'
		},
		{
			label: 'Adresse (complément)',
			hint: 'Ex : 1er étage',
			key: 'address2'
		},
		{
			label: 'Code postal',
			hint: 'Ex : 75 008',
			key: 'postalCode'
		},
		{
			label: 'Ville',
			hint: 'Ex : Paris',
			key: 'city'
		}
	];

	export let onInput = undefined;
	export let disabledKeys: Partial<Record<keyof BeneficiaryAccount, boolean>> = {};
	export let account: BeneficiaryAccount = {};

	let cerOptions = cerObjectLabelValue.map(({ label, value }) => ({ name: value, label }));
	$: selectedCerOption = cerOptions.find(({ name }) => name === account.cerObject);
	function handleCerSelected({ detail }) {
		account.cerObjects = [detail.selected.name];
	}

	let rightsOptions = rightLabelValue.map(({ label, value }) => ({ name: value, label }));
	$: selectedRightsOption = rightsOptions.find(({ name }) => name === account.rights);
	function handleRightsSelected({ detail }) {
		account.rights = [detail.selected.name];
	}

	let situationOptions = workSituationLabelValue.map(({ label, value }) => ({
		name: value,
		label
	}));
	$: selectedSituationOption = situationOptions.find(({ name }) => name === account.workSituation);
	function handleSituationSelected({ detail }) {
		account.workSituations = [detail.selected.name];
	}
</script>

{#each inputs as input (input.key)}
	<Input
		bind:val={account[input.key]}
		inputHint={input.hint}
		inputLabel={input.label}
		on:input={onInput}
		disabled={disabledKeys[input.key]}
		type={input.type}
	/>
{/each}
<Select
	selectLabel={'Sujet CER'}
	selectHint={"Ex : Réalisation d'une formation de cuisine"}
	options={cerOptions}
	selected={selectedCerOption}
	on:select={handleCerSelected}
/>
<Select
	selectLabel={'Mes droits'}
	selectHint={'Ex : Droits'}
	options={rightsOptions}
	selected={selectedRightsOption}
	on:select={handleRightsSelected}
/>
<Select
	selectLabel={'Situation'}
	selectHint={'Ex : Sans emploi'}
	options={situationOptions}
	selected={selectedSituationOption}
	on:select={handleSituationSelected}
/>
