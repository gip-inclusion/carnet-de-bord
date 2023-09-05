<script lang="ts" context="module">
	export type FormBeneficiary = Pick<
		Beneficiary,
		| 'id'
		| 'firstname'
		| 'lastname'
		| 'dateOfBirth'
		| 'nir'
		| 'mobileNumber'
		| 'email'
		| 'address1'
		| 'address2'
		| 'postalCode'
		| 'city'
		| 'peNumber'
		| 'cafNumber'
		| 'rightRsa'
		| 'rightAre'
		| 'rightAss'
		| 'rightBonus'
	>;
</script>

<script lang="ts">
	import { trimToNull } from '$lib/helpers';
	import type { Beneficiary } from '$lib/graphql/_gen/typed-document-nodes';
	import { Button } from '$lib/ui/base';
	import {
		beneficiaryAccountPartialSchema,
		beneficiaryAccountSchema,
		type BeneficiaryAccountInput,
	} from '$lib/ui/ProBeneficiaryUpdate/beneficiary.schema';
	import Form from '$lib/ui/forms/Form.svelte';
	import ProBeneficiaryUpdateFields from '$lib/ui/ProBeneficiaryUpdate/ProBeneficiaryUpdateFields.svelte';
	import type { Field } from '$lib/ui/ProBeneficiaryUpdate/ProBeneficiaryUpdateFields.svelte';
	import Input from '$lib/ui/forms/Input.svelte';

	import { RoleEnum } from '$lib/graphql/_gen/typed-document-nodes';

	import { formatNames } from '../format';

	export let beneficiary: FormBeneficiary;

	export let canEditDetailedInfo = false;

	const initialValues = {
		...formatNames(beneficiary),
		dateOfBirth: beneficiary.dateOfBirth,
		nir: beneficiary.nir,
		mobileNumber: beneficiary.mobileNumber,
		email: beneficiary.email,
		address1: beneficiary.address1,
		address2: beneficiary.address2,
		postalCode: beneficiary.postalCode,
		city: beneficiary.city,
		peNumber: beneficiary.peNumber,
		cafNumber: beneficiary.cafNumber,
		rightRsa: beneficiary.rightRsa,
		rightAre: beneficiary.rightAre,
		rightAss: beneficiary.rightAss,
		rightBonus: beneficiary.rightBonus,
	};

	export let onSubmit: (isPartialUpdate: boolean, values: BeneficiaryAccountInput) => void;
	export let onCancel: () => void;
	export let role: RoleEnum;
	const isPartialUpdate = role !== RoleEnum.Manager;

	const validationSchema = isPartialUpdate
		? beneficiaryAccountPartialSchema
		: beneficiaryAccountSchema;

	const partialUpdateDisabledFields: Field[] = isPartialUpdate
		? ['firstname', 'lastname', 'dateOfBirth', 'nir']
		: [];

	const disabledFields: Field[] = partialUpdateDisabledFields.concat(
		canEditDetailedInfo ? [] : ['rightRsa', 'rightAre', 'rightAss', 'rightBonus']
	);
	const _onSubmit = (values) => {
		onSubmit(isPartialUpdate, { ...values, nir: trimToNull(values.nir ?? '') });
	};
</script>

<section>
	<h1>Informations personnelles</h1>
	<Form {initialValues} {validationSchema} onSubmit={_onSubmit}>
		<ProBeneficiaryUpdateFields {disabledFields} />
		<Input
			name="peNumber"
			placeholder={'123456789A'}
			class="pt-6"
			inputLabel={'Identifiant Pôle emploi'}
			disabled={!canEditDetailedInfo}
		/>
		<Input
			name="cafNumber"
			placeholder={'123456789A'}
			inputLabel={'Identifiant CAF/MSA'}
			disabled={!canEditDetailedInfo}
		/>
		<div class="flex flex-row gap-6 pt-4 pb-12">
			<Button type="submit">Enregistrer</Button>
			<Button outline on:click={onCancel}>Annuler</Button>
		</div>
	</Form>
</section>
