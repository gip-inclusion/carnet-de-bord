<script context="module" lang="ts">
</script>

<script lang="ts">
	import {
		Beneficiary,
		UpdateBeneficiaryPersonalInfoDocument,
	} from '$lib/graphql/_gen/typed-document-nodes';
	import { openComponent } from '$lib/stores';
	import { mutation, operationStore } from '@urql/svelte';
	import Button from '../base/Button.svelte';
	import Input from '../base/Input.svelte';

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

	function initFormData(): typeof beneficiary {
		return {
			id: beneficiary.id,
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
	}

	const formData = initFormData();

	async function handleSubmit() {
		await update({
			id: beneficiary.id,
			...formData,
		});
		openComponent.close();
	}

	function onCancel() {
		openComponent.close();
	}
</script>

<section class="pl-4">
	<div class="pb-8">
		<h1>Informations personnelles</h1>
		<p class="mb-0">Veuillez cliquer sur un champ pour le modifier.</p>
	</div>
	<form on:submit|preventDefault={handleSubmit}>
		<Input bind:val={formData.lastname} inputLabel="Nom" />
		<Input bind:val={formData.firstname} inputLabel="Prénom" />
		<Input bind:val={formData.dateOfBirth} inputLabel="Date de naissance" type="date" />
		<Input bind:val={formData.mobileNumber} inputLabel="Téléphone" />
		<Input bind:val={formData.email} inputLabel="Email" type="email" />
		<Input bind:val={formData.address1} inputLabel="Adresse" />
		<div class="flex gap-2">
			<Input bind:val={formData.postalCode} inputLabel="Code postal" />
			<Input bind:val={formData.city} inputLabel="Ville" />
		</div>

		<Input bind:val={formData.peNumber} inputLabel="Identifiant Pôle emploi" />
		<Input bind:val={formData.cafNumber} inputLabel="Identifiant CAF" />

		<div class="flex flex-row gap-6 pt-4 pb-12">
			<Button type="submit">Enregistrer</Button>
			<Button outline on:click={onCancel}>Annuler</Button>
		</div>
	</form>
</section>
