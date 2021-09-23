<script context="module" lang="ts">
</script>

<script lang="ts">
	import {
		Beneficiary,
		UpdateBeneficiaryPersonalInfoDocument,
	} from '$lib/graphql/_gen/typed-document-nodes';
	import { openComponent } from '$lib/stores';
	import type { InputItem } from '$lib/types';
	import { mutation, operationStore } from '@urql/svelte';
	import { Button, Input } from '$lib/ui/base';

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
	const fieldErrors: Partial<typeof beneficiary> = {};

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

	let inputs: InputItem[] = [
		{
			label: 'Nom',
			hint: 'Ex : Poquelin',
			key: 'firstname',
			required: true,
		},
		{
			label: 'Prénom',
			hint: 'Ex : Jean-Baptiste',
			key: 'lastname',
			required: true,
		},
		{
			label: 'Date de naissance (JJ/MM/AAAA)',
			hint: 'Ex : 21/12/1977',
			key: 'dateOfBirth',
			type: 'date',
			required: true,
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
		{
			label: 'Identifiant Pôle emploi',
			hint: 'Ex : 123456789A',
			key: 'peNumber',
		},
		{
			label: 'Identifiant CAF',
			hint: 'Ex : 123456789A',
			key: 'cafNumber',
		},
	];
</script>

<section class="pl-4">
	<div class="pb-8">
		<h1>Informations personnelles</h1>
		<p class="mb-0">Veuillez cliquer sur un champ pour le modifier.</p>
	</div>
	<form on:submit|preventDefault={handleSubmit}>
		{#each inputs as input (input.key)}
			<Input
				bind:val={formData[input.key]}
				inputHint={input.hint}
				inputLabel={input.label}
				error={fieldErrors[input.key]}
				type={input.type}
			/>
		{/each}

		<div class="flex flex-row gap-6 pt-4 pb-12">
			<Button type="submit">Enregistrer</Button>
			<Button outline on:click={onCancel}>Annuler</Button>
		</div>
	</form>
</section>
