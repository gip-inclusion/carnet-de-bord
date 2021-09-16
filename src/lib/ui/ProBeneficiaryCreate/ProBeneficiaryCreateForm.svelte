<script context="module" lang="ts">
	import type { InputType } from '$lib/types';
	import { Input, Select } from '$lib/ui/base';
	import type { BeneficiaryAccount } from '$lib/types';
	import { workSituationKeys } from '$lib/constants/keys';
</script>

<script lang="ts">
	let inputs: {
		label: string;
		hint: string;
		type?: InputType;
		key: keyof Exclude<BeneficiaryAccount, 'workSituation'>;
	}[] = [
		{
			label: 'Nom',
			hint: 'Ex : Poquelin',
			key: 'firstname',
		},
		{
			label: 'Prénom',
			hint: 'Ex : Jean-Baptiste',
			key: 'lastname',
		},
		{
			label: 'Date de naissance (JJ/MM/AAAA)',
			hint: 'Ex : 21/12/1977',
			key: 'dateOfBirth',
		},
		{
			label: 'Téléphone',
			hint: 'Ex : 0123456789',
			key: 'mobileNumber',
		},
		{
			label: 'Adresse de courriel',
			hint: 'Ex : jb@poquelin.fr',
			key: 'email',
			type: 'email',
		},
		{
			label: 'Adresse',
			hint: 'Ex : 55-57 rue du Faubourg Saint-Honoré',
			key: 'address1',
		},
		{
			label: 'Adresse (complément)',
			hint: 'Ex : 1er étage',
			key: 'address2',
		},
		{
			label: 'Code postal',
			hint: 'Ex : 75 008',
			key: 'postalCode',
		},
		{
			label: 'Ville',
			hint: 'Ex : Paris',
			key: 'city',
		},
	];

	export let disabledKeys: Partial<Record<keyof BeneficiaryAccount, boolean>> = {};
	export let beneficiaryAccount: BeneficiaryAccount = {};

	let situationOptions = workSituationKeys.options;

	$: selectedSituationOption = situationOptions.find(
		({ name }) => beneficiaryAccount.workSituation === name
	);
	function handleSituationSelected({ detail }) {
		beneficiaryAccount.workSituation = detail.selected.name;
	}

	function handleSingleAccountKey(key: string) {
		return (e: CustomEvent) => {
			beneficiaryAccount[key] = e.detail.value;
		};
	}

	function flatten(data: string | string[]) {
		if (Array.isArray(data)) {
			return data.join(', ');
		}
		return data;
	}
</script>

{#each inputs as input (input.key)}
	<Input
		val={flatten(beneficiaryAccount[input.key])}
		inputHint={input.hint}
		inputLabel={input.label}
		on:input={handleSingleAccountKey(input.key)}
		disabled={disabledKeys[input.key]}
		type={input.type}
	/>
{/each}
<Select
	selectLabel={'Situation'}
	selectHint={'Ex : Sans emploi'}
	options={situationOptions}
	selected={selectedSituationOption}
	on:select={handleSituationSelected}
/>
