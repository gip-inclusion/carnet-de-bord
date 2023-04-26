<script lang="ts">
	import { openComponent, token } from '$lib/stores';

	import { Alert, Button } from '$lib/ui/base';
	import { Form, Input } from '$lib/ui/forms';
	import { type AdminDeploymentType, adminDeploymentSchema } from './adminDeployment.schema';
	import { postApiJson } from '$lib/utils/post';
	import { captureException } from '$lib/utils/sentry';

	const initialValues = {
		email: '',
		deployment: '',
		departmentCode: '',
	};
	let errorMessage = '';
	export let onClose: () => void;

	async function handleSubmit(values: AdminDeploymentType) {
		const data = adminDeploymentSchema.cast(values);
		try {
			await postApiJson(
				'/v1/deployment',
				{
					manager_email: data.email,
					departement_code: data.departmentCode,
					label: data.deployment,
				},
				{
					Authorization: `Bearer ${$token}`,
				}
			);
			close();
		} catch (error) {
			captureException(error);
			errorMessage = error.message || 'Création du déploiement impossible.';
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
		<h1>Ajouter un Déploiement</h1>
		<p class="mb-0">
			Veuillez renseigner les informations ci-dessous pour créer un nouveau déploiement. Un
			déploiement permet de rattacher des structures et des bénéficiaires.
		</p>
		<p class="mb-0">
			Un email sera envoyé au responsable du déploiement pour qu'il crée son compte sur Carnet de
			bord.
		</p>
	</div>

	<Form
		class="flex flex-col gap-6"
		{initialValues}
		validationSchema={adminDeploymentSchema}
		onSubmit={handleSubmit}
		let:isSubmitted
		let:isSubmitting
		let:isValid
		><div class="fr-grid-row fr-grid-row--gutters">
			<div class="fr-col-md-12 fr-col-lg-8">
				<Input name="deployment" required inputLabel="Nom du déploiement" />
			</div>
			<div class="fr-col-md-12 fr-col-lg-4">
				<Input name="departmentCode" required inputLabel="Département" />
			</div>
		</div>
		<Input name="email" required inputLabel="Courriel du gestionnaire" />
		{#if errorMessage}
			<div class="mb-8">
				<Alert title="Erreur" type="error" description={errorMessage} />
			</div>
		{/if}
		<div class="flex flex-row gap-6 mt-12">
			<Button type="submit" disabled={isSubmitting || (isSubmitted && !isValid)}
				>Créer le déploiement</Button
			>
			<Button outline={true} on:click={close}>Annuler</Button>
		</div>
	</Form>
</div>
