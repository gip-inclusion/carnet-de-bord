<script lang="ts">
	import {
		Beneficiary,
		UpdateBeneficiaryPersonalInfoDocument,
	} from '$lib/graphql/_gen/typed-document-nodes';
	import { openComponent } from '$lib/stores';
	import { mutation, operationStore } from '@urql/svelte';
	import { Button } from '$lib/ui/base';
	import {
		BeneficiaryAccountInput,
		beneficiaryAccountSchema,
	} from '../ProBeneficiaryCreate/beneficiary.schema';
	import Form from '../forms/Form.svelte';
	import ProBeneficiaryCreateFields from '../ProBeneficiaryCreate/ProBeneficiaryCreateFields.svelte';
	import Input from '../forms/Input.svelte';

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
	console.log(beneficiary);

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
		await update({
			id: beneficiary.id,
			...values,
			dateOfBirth: new Date(values.dateOfBirth),
		});
		openComponent.close();
	}

	function onCancel() {
		openComponent.close();
	}
</script>

<section>
	<div class="pb-8">
		<h1>Informations personnelles</h1>
		<p class="mb-0">Veuillez cliquer sur un champ pour le modifier.</p>
	</div>
	<Form
		{initialValues}
		validationSchema={beneficiaryAccountSchema}
		onSubmit={updateBeneficiary}
		let:isSubmitting
		let:isSubmitted
		let:isValid
	>
		<ProBeneficiaryCreateFields />
		<Input name="peNumber" placeholder={'123456789A'} inputLabel={'Identifiant Pôle emploi'} />
		<Input name="cafNumber" placeholder={'123456789A'} inputLabel={'Identifiant CAF/MSA'} />
		<div class="flex flex-row gap-6 pt-4 pb-12">
			<Button type="submit">Enregistrer</Button>
			<Button outline on:click={onCancel}>Annuler</Button>
		</div>
	</Form>
</section>
