<script lang="ts">
	import { openComponent } from '$lib/stores';
	import type { Professional, ProfessionalSetInput } from '$lib/graphql/_gen/typed-document-nodes';
	import { mutation, operationStore } from '@urql/svelte';
	import { UpdateProfessionalAccountDocument } from '$lib/graphql/_gen/typed-document-nodes';
	import { Form, Input } from '$lib/ui/forms';
	import { Alert, Button } from '../base/';
	import { proAccountSchema } from '$lib/ui/ProCreationForm/pro.schema';

	export let professional: Pick<
		Professional,
		'id' | 'firstname' | 'lastname' | 'mobileNumber' | 'email' | 'position'
	>;

	let errorMessage = '';

	function closeLayer() {
		openComponent.close();
	}

	const updateProfessionalAccountStore = operationStore(UpdateProfessionalAccountDocument);
	const updateProfessionalAccount = mutation(updateProfessionalAccountStore);

	async function editProfessionalAccountSubmitHandler(payload: ProfessionalSetInput) {
		try {
			await updateProfessionalAccount({ id: professional.id, payload });
			closeLayer();
		} catch (error) {
			console.error(error);
			errorMessage = 'Impossible de modifier ce professionnel';
		}
	}
</script>

<div class="flex flex-col gap-6">
	<div>
		<h1>Mettre à jour les informations du professionnel</h1>
	</div>

	<Form
		initialValues={{
			firstname: professional.firstname,
			lastname: professional.lastname,
			email: professional.email,
			mobileNumber: professional.mobileNumber,
			position: professional.position,
		}}
		validationSchema={proAccountSchema}
		onSubmit={editProfessionalAccountSubmitHandler}
		let:isSubmitting
		let:isSubmitted
		let:isValid
	>
		<div class="max-w-sm">
			<h2 class="text-france-blue fr-h4">Informations personnelles</h2>

			<Input placeholder="Jean Baptiste" inputLabel="Prénom" name="firstname" required />
			<Input placeholder="Poquelin" inputLabel="Nom" name="lastname" required />
			<Input placeholder="b@poquelin.fr" inputLabel="Courriel" name="email" required />
			<Input placeholder="0789542136" inputLabel="Numéro de téléphone" name="mobileNumber" />
			<Input placeholder="Conseiller en insertion" inputLabel="Position" name="position" />
			<div class="flex flex-row gap-6 mt-12">
				<Button type="submit" disabled={(isSubmitted && !isValid) || isSubmitting}
					>Enregistrer les modifications</Button
				>
				<Button outline={true} on:click={closeLayer}>Annuler</Button>
			</div>
		</div>
	</Form>
	{#if errorMessage}
		<div class="mb-8">
			<Alert type="error" description={errorMessage} />
		</div>
	{/if}
</div>
