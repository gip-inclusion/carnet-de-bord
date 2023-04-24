<script lang="ts">
	import { openComponent } from '$lib/stores';
	import { Alert, Button } from '$lib/ui/base';
	import { Form, Input } from '$lib/ui/forms';
	import {
		type DeploymentAdminPdiType,
		deploymentAdminPdiSchema,
	} from '../Deployment/adminDeployment.schema';
	import { postApiJson } from '$lib/utils/post';

	export let deploymentId = '';
	export let onClose: () => void;

	const initialValues = {
		email: '',
		firstname: '',
		lastname: '',
	};

	let errorMessage = '';

	async function handleSubmit(values: DeploymentAdminPdiType) {
		const data = Object.assign(values, { deployment_id: deploymentId });
		try {
			await postApiJson('/v1/managers/create', data);
			close();
		} catch (error) {
			console.error(error);
			errorMessage = error;
		}
	}

	function close() {
		if (onClose) {
			onClose();
		}
		openComponent.close();
	}
</script>

<div class="flex flex-col gap-6">
	<div>
		<h1>Ajouter un Admin de territoire</h1>
		<p class="mb-0">
			Veuillez renseigner les informations ci-dessous pour ajouter un nouvel administrateur.
		</p>
		<p class="mb-0">Un email d'activation sera envoyé à la personne nouvellement ajoutée.</p>
	</div>

	<Form
		class="flex flex-col gap-6"
		{initialValues}
		validationSchema={deploymentAdminPdiSchema}
		onSubmit={handleSubmit}
		let:isSubmitted
		let:isSubmitting
		let:isValid
	>
		<Input name="email" required inputLabel="Courriel" />
		<Input name="firstname" required inputLabel="Prénom" />
		<Input name="lastname" required inputLabel="Nom" />
		{#if errorMessage}
			<div class="mb-8">
				<Alert
					type="error"
					title="Impossible de rajouter cet administrateur"
					description={errorMessage}
				/>
			</div>
		{/if}
		<div class="flex flex-row gap-6 mt-12">
			<Button type="submit" disabled={isSubmitting || (isSubmitted && !isValid)}
				>Ajouter l'admin</Button
			>
			<Button outline={true} on:click={close}>Annuler</Button>
		</div>
	</Form>
</div>
