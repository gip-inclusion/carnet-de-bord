<script lang="ts">
	import {
		RoleEnum,
		UpdateOrientationManagerProfileDocument,
		type UpdateOrientationManagerProfileMutation,
	} from '$lib/graphql/_gen/typed-document-nodes';
	import { homeForRole } from '$lib/routes';
	import { accountData } from '$lib/stores';
	import OrientationManagerCreationForm from '$lib/ui/OrientationManager/CreationForm.svelte';
	import type { OrientationManagerAccountInput } from '$lib/ui/OrientationManager/orientationManager.schema';
	import { Alert } from '$lib/ui/base';
	import { formatNames } from '$lib/ui/format';
	import { mutation, operationStore, type OperationStore } from '@urql/svelte';

	const updateProfileResult = operationStore(UpdateOrientationManagerProfileDocument);
	const updateProfile = mutation(updateProfileResult);
	let updateResult: OperationStore<UpdateOrientationManagerProfileMutation>;

	let error: string;

	const { id, email, firstname, lastname, phoneNumbers } = $accountData.orientation_manager;

	const initialValues = {
		email,
		...formatNames({ firstname, lastname }),
		phoneNumbers,
	};

	async function handleSubmit(values: OrientationManagerAccountInput) {
		updateResult = await updateProfile({
			id,
			accountId: $accountData.id,
			...values,
		});

		if (updateResult.data?.updateAccount) {
			const { confirmed, onboardingDone, username, orientation_manager } =
				updateResult.data.updateAccount;

			$accountData = {
				...$accountData,
				confirmed,
				onboardingDone,
				username,
				orientation_manager,
			};
		}
		if (updateResult.error) {
			error = "L'enregistrement a échoué.";
		}
	}
</script>

<svelte:head>
	<title>Creation du compte - Carnet de bord</title>
</svelte:head>
<div class="pt-12">
	{#if !$updateResult?.data && !$updateResult?.error}
		<h1>Création de mon compte Chargé d'orientation</h1>
		<p>
			Vous avez été invité(e) à créer votre compte de Chargé d'orientation.
			<br />Il ne reste plus que quelques étapes pour accéder à tous les services proposés !
		</p>
		<OrientationManagerCreationForm
			onSubmit={handleSubmit}
			accountRequest={initialValues}
			submitLabel="Créer mon compte"
		/>
	{/if}
	{#if $updateResult?.data}
		<h1>Votre compte a été créé avec succès !</h1>
		<p>
			Bienvenue à bord !<br />
			Cliquez sur le bouton ci-dessous pour accéder à votre compte.
		</p>
		<div>
			<a class="fr-btn" href={homeForRole(RoleEnum.OrientationManager)} title="Aller à l'accueil">
				Accéder à mon compte
			</a>
		</div>
	{:else if error}
		<div class="mb-8">
			<Alert type="error" description={error} />
		</div>
	{/if}
</div>
