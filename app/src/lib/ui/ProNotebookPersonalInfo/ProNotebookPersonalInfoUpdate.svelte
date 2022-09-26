<script lang="ts">
	import {
		Beneficiary,
		UpdateBeneficiaryPersonalInfoDocument,
	} from '$lib/graphql/_gen/typed-document-nodes';
	import { account, openComponent } from '$lib/stores';
	import { mutation, operationStore } from '@urql/svelte';
	import { Button } from '$lib/ui/base';
	import {
		BeneficiaryAccountInput,
		beneficiaryAccountSchema,
	} from '$lib/ui/ProBeneficiaryUpdate/beneficiary.schema';
	import Form from '$lib/ui/forms/Form.svelte';
	import ProBeneficiaryUpdateFields from '$lib/ui/ProBeneficiaryUpdate/ProBeneficiaryUpdateFields.svelte';
	import Input from '$lib/ui/forms/Input.svelte';
	import { trackEvent } from '$lib/tracking/matomo';
	import type { Field } from '$lib/ui/ProBeneficiaryUpdate/ProBeneficiaryUpdateFields.svelte';

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
	>;

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
	};

	async function updateBeneficiary(values: BeneficiaryAccountInput) {
		trackEvent('pro', 'notebook', 'update personnal info');
		await update({
			id: beneficiary.id,
			...values,
		});
		openComponent.close();
	}

	function onCancel() {
		openComponent.close();
	}

	function hiddenFields(): Field[] {
		if ($account.type === 'adminStructure' || $account.type === 'adminCdb') {
			return [];
		}
		return ['firstname', 'lastname', 'date-of-birth'];
	}
</script>

<section>
	<div class="pb-8">
		<h1>Informations personnelles</h1>
		<p class="mb-0">Veuillez cliquer sur un champ pour le modifier.</p>
	</div>
	<Form {initialValues} validationSchema={beneficiaryAccountSchema} onSubmit={updateBeneficiary}>
		<ProBeneficiaryUpdateFields hiddenFields={hiddenFields()} />
		<Input name="peNumber" placeholder={'123456789A'} inputLabel={'Identifiant Pôle emploi'} />
		<Input name="cafNumber" placeholder={'123456789A'} inputLabel={'Identifiant CAF/MSA'} />
		<div class="flex flex-row gap-6 pt-4 pb-12">
			<Button type="submit">Enregistrer</Button>
			<Button outline on:click={onCancel}>Annuler</Button>
		</div>
	</Form>
</section>
