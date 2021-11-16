<script context="module" lang="ts">
	import type { InputItem } from '$lib/types';
	import { Input } from '$lib/ui/base';
	import type { BeneficiaryAccount } from '$lib/types';
</script>

<script lang="ts">
	export let errors: Partial<BeneficiaryAccount> = {};
	export let onInput: (key: string) => () => void | null = null;
	const lastnameInput: InputItem = {
		label: 'Nom',
		hint: 'Ex : Poquelin',
		key: 'firstname',
		required: true,
	};
	const firstnameInput: InputItem = {
		label: 'Prénom',
		hint: 'Ex : Jean-Baptiste',
		key: 'lastname',
		required: true,
	};
	const dateOfBirthInput: InputItem = {
		label: 'Date de naissance (JJ/MM/AAAA)',
		hint: 'Ex : 21/12/1977',
		key: 'dateOfBirth',
		type: 'date',
		required: true,
	};
	const phoneInput: InputItem = {
		label: 'Téléphone',
		hint: 'Ex : 0123456789',
		key: 'mobileNumber',
	};
	const emailInput: InputItem = {
		label: 'Courriel',
		hint: 'Ex : jb@poquelin.fr',
		key: 'email',
		type: 'email',
	};
	const address1Input: InputItem = {
		label: 'Adresse',
		hint: 'Ex : 55-57 rue du Faubourg Saint-Honoré',
		key: 'address1',
	};
	const address2Input: InputItem = {
		label: 'Adresse (complément)',
		hint: 'Ex : 1er étage',
		key: 'address2',
	};
	const postalCodeInput: InputItem = {
		label: 'Code postal',
		hint: 'Ex : 75 008',
		key: 'postalCode',
	};
	const cityInput: InputItem = {
		label: 'Ville',
		hint: 'Ex : Paris',
		key: 'city',
	};

	export let disabledKeys: Partial<Record<keyof BeneficiaryAccount, boolean>> = {};
	export let beneficiaryAccount: BeneficiaryAccount = {};
</script>

<Input
	bind:val={beneficiaryAccount[lastnameInput.key]}
	inputHint={lastnameInput.hint}
	inputLabel={lastnameInput.label}
	disabled={disabledKeys[lastnameInput.key]}
	type={lastnameInput.type}
	error={errors[lastnameInput.key]}
	required={lastnameInput.required}
	on:input={onInput(lastnameInput.key)}
/>
<Input
	bind:val={beneficiaryAccount[firstnameInput.key]}
	inputHint={firstnameInput.hint}
	inputLabel={firstnameInput.label}
	disabled={disabledKeys[firstnameInput.key]}
	type={firstnameInput.type}
	error={errors[firstnameInput.key]}
	required={firstnameInput.required}
	twWidthClass="w-10/12"
	on:input={onInput(firstnameInput.key)}
/>
<Input
	bind:val={beneficiaryAccount[dateOfBirthInput.key]}
	inputHint={dateOfBirthInput.hint}
	inputLabel={dateOfBirthInput.label}
	disabled={disabledKeys[dateOfBirthInput.key]}
	type={dateOfBirthInput.type}
	error={errors[dateOfBirthInput.key]}
	required={dateOfBirthInput.required}
	twWidthClass="w-4/12"
	on:input={onInput(dateOfBirthInput.key)}
/>
<Input
	bind:val={beneficiaryAccount[phoneInput.key]}
	inputHint={phoneInput.hint}
	inputLabel={phoneInput.label}
	disabled={disabledKeys[phoneInput.key]}
	type={phoneInput.type}
	error={errors[phoneInput.key]}
	required={phoneInput.required}
	twWidthClass="w-4/12"
	on:input={onInput(phoneInput.key)}
/>
<Input
	bind:val={beneficiaryAccount[emailInput.key]}
	inputHint={emailInput.hint}
	inputLabel={emailInput.label}
	disabled={disabledKeys[emailInput.key]}
	type={emailInput.type}
	error={errors[emailInput.key]}
	required={emailInput.required}
	on:input={onInput(emailInput.key)}
/>
<Input
	bind:val={beneficiaryAccount[address1Input.key]}
	inputHint={address1Input.hint}
	inputLabel={address1Input.label}
	disabled={disabledKeys[address1Input.key]}
	type={address1Input.type}
	error={errors[address1Input.key]}
	required={address1Input.required}
	on:input={onInput(address1Input.key)}
/>
<Input
	bind:val={beneficiaryAccount[address2Input.key]}
	inputHint={address2Input.hint}
	inputLabel={address2Input.label}
	disabled={disabledKeys[address2Input.key]}
	type={address2Input.type}
	error={errors[address2Input.key]}
	required={address2Input.required}
	on:input={onInput(address2Input.key)}
/>
<div class="flex flex-row gap-6">
	<Input
		bind:val={beneficiaryAccount[postalCodeInput.key]}
		inputHint={postalCodeInput.hint}
		inputLabel={postalCodeInput.label}
		disabled={disabledKeys[postalCodeInput.key]}
		type={postalCodeInput.type}
		error={errors[postalCodeInput.key]}
		required={postalCodeInput.required}
		on:input={onInput(postalCodeInput.key)}
		twWidthClass="w-1/3"
	/>
	<Input
		bind:val={beneficiaryAccount[cityInput.key]}
		inputHint={cityInput.hint}
		inputLabel={cityInput.label}
		disabled={disabledKeys[cityInput.key]}
		type={cityInput.type}
		error={errors[cityInput.key]}
		required={cityInput.required}
		on:input={onInput(cityInput.key)}
		twWidthClass="w-2/3"
	/>
</div>
