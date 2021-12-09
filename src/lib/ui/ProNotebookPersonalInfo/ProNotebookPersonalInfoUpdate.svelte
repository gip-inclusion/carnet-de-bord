<script context="module" lang="ts">
</script>

<script lang="ts">
	import {
		Beneficiary,
		UpdateBeneficiaryPersonalInfoDocument,
	} from '$lib/graphql/_gen/typed-document-nodes';
	import { openComponent } from '$lib/stores';
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
</script>

<section>
	<div class="pb-8">
		<h1>Informations personnelles</h1>
		<p class="mb-0">Veuillez cliquer sur un champ pour le modifier.</p>
	</div>
	<form on:submit|preventDefault={handleSubmit}>
		<Input
			bind:value={formData['firstname']}
			placeholder={'Ex : Poquelin'}
			inputLabel={'Nom'}
			error={fieldErrors['firstname']}
			required={true}
		/>
		<Input
			bind:value={formData['lastname']}
			placeholder={'Ex : Jean-Baptiste'}
			inputLabel={'Prénom'}
			error={fieldErrors['lastname']}
			required={true}
		/>
		<!-- <Input
			bind:value={formData['dateOfBirth']}
			placeholder={'Ex : 21/12/1977'}
			inputLabel={'Date de naissance (JJ/MM/AAAA)'}
			error={fieldErrors['dateOfBirth']}
			type={'text'}
			required={true}
		/> -->
		<Input
			bind:value={formData['mobileNumber']}
			placeholder={'Ex : 0123456789'}
			inputLabel={'Téléphone'}
			error={fieldErrors['mobileNumber']}
		/>
		<Input
			bind:value={formData['email']}
			placeholder={'Ex : jb@poquelin.fr'}
			inputLabel={'Courriel'}
			error={fieldErrors['email']}
			type={'email'}
		/>
		<Input
			bind:value={formData['address1']}
			placeholder={'Ex : 55-57 rue du Faubourg Saint-Honoré'}
			inputLabel={'Adresse'}
			error={fieldErrors['address1']}
		/>
		<Input
			bind:value={formData['address2']}
			placeholder={'Ex : 1er étage'}
			inputLabel={'Adresse (complément)'}
			error={fieldErrors['address2']}
		/>
		<Input
			bind:value={formData['postalCode']}
			placeholder={'Ex : 75 008'}
			inputLabel={'Code postal'}
			error={fieldErrors['postalCode']}
		/>
		<Input
			bind:value={formData['city']}
			placeholder={'Ex : Paris'}
			inputLabel={'Ville'}
			error={fieldErrors['city']}
		/>
		<Input
			bind:value={formData['peNumber']}
			placeholder={'Ex : 123456789A'}
			inputLabel={'Identifiant Pôle emploi'}
			error={fieldErrors['peNumber']}
		/>
		<Input
			bind:value={formData['cafNumber']}
			placeholder={'Ex : 123456789A'}
			inputLabel={'Identifiant CAF/MSA'}
			error={fieldErrors['cafNumber']}
		/>
		<div class="flex flex-row gap-6 pt-4 pb-12">
			<Button type="submit">Enregistrer</Button>
			<Button outline on:click={onCancel}>Annuler</Button>
		</div>
	</form>
</section>
