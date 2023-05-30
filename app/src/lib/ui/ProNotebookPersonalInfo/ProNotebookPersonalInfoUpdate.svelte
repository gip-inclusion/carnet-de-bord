<script lang="ts">
	import {
		type Beneficiary,
		UpdateBeneficiaryPersonalInfoDocument,
	} from '$lib/graphql/_gen/typed-document-nodes';
	import { accountData, openComponent } from '$lib/stores';
	import { mutation, operationStore } from '@urql/svelte';
	import { Button } from '$lib/ui/base';
	import {
		type BeneficiaryAccountInput,
		beneficiaryAccountPartialSchema,
		beneficiaryAccountSchema,
	} from '$lib/ui/ProBeneficiaryUpdate/beneficiary.schema';
	import Form from '$lib/ui/forms/Form.svelte';
	import ProBeneficiaryUpdateFields from '$lib/ui/ProBeneficiaryUpdate/ProBeneficiaryUpdateFields.svelte';
	import type { Field } from '$lib/ui/ProBeneficiaryUpdate/ProBeneficiaryUpdateFields.svelte';
	import Input from '$lib/ui/forms/Input.svelte';
	import { trackEvent } from '$lib/tracking/matomo';

	import { RoleEnum } from '$lib/graphql/_gen/typed-document-nodes';

	export let beneficiary: Pick<
		Beneficiary,
		| 'id'
		| 'firstname'
		| 'lastname'
		| 'dateOfBirth'
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

	export let canEditDetailedInfo = false;

	const updateStore = operationStore(UpdateBeneficiaryPersonalInfoDocument);
	const update = mutation(updateStore);

	const initialValues = {
		firstname: beneficiary.firstname,
		lastname: beneficiary.lastname,
		dateOfBirth: beneficiary.dateOfBirth,
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

	const isPartialUpdate = $accountData.type !== RoleEnum.Manager;

	const validationSchema = isPartialUpdate
		? beneficiaryAccountPartialSchema
		: beneficiaryAccountSchema;

	const partialUpdateDisabledFields: Field[] = isPartialUpdate
		? ['firstname', 'lastname', 'dateOfBirth']
		: [];

	const disabledFields: Field[] = partialUpdateDisabledFields.concat(
		canEditDetailedInfo ? [] : ['rightRsa', 'rightAre', 'rightAss', 'rightBonus']
	);

	async function updateBeneficiary(values: BeneficiaryAccountInput) {
		const partialUpdatePayload = isPartialUpdate
			? { ...values, firstname: undefined, lastname: undefined, dateOfBirth: undefined }
			: { ...values };

		const detailedPayload = canEditDetailedInfo
			? { ...partialUpdatePayload }
			: {
					...partialUpdatePayload,
					peNumber: undefined,
					cafNumber: undefined,
					rightAre: undefined,
					rightAss: undefined,
					rightBonus: undefined,
					rightRsa: undefined,
			  };
		trackEvent('pro', 'notebook', 'update personnal info');

		await update({
			id: beneficiary.id,
			payload: detailedPayload,
		});
		openComponent.close();
	}

	function onCancel() {
		openComponent.close();
	}
</script>

<section>
	<h1>Informations personnelles</h1>
	{canEditDetailedInfo}
	<Form {initialValues} {validationSchema} onSubmit={updateBeneficiary}>
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
