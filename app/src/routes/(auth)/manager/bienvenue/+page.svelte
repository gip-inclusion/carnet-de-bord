<script lang="ts">
	import { accountData } from '$lib/stores/account';
	import {
		RoleEnum,
		UpdateManagerProfileDocument,
		type UpdateManagerProfileMutation,
	} from '$lib/graphql/_gen/typed-document-nodes';
	import { type OperationStore, mutation, operationStore } from '@urql/svelte';
	import { homeForRole } from '$lib/routes';
	import { Alert } from '$lib/ui/base';
	import ManagerCreationForm from '$lib/ui/Manager/CreationForm.svelte';

	import type { ProAccountInput } from '$lib/ui/ProCreationForm/pro.schema';

	const updateProfileResult = operationStore(UpdateManagerProfileDocument);
	const updateProfile = mutation(updateProfileResult);
	let updateResult: OperationStore<UpdateManagerProfileMutation>;

	let error: string;

	const { id, email, firstname, lastname } = $accountData.manager;

	const initialValues = {
		email,
		firstname,
		lastname,
	};

	async function handleSubmit(values: ProAccountInput) {
		updateResult = await updateProfile({
			id,
			accountId: $accountData.id,
			...values,
		});

		if (updateResult.data?.updateAccount) {
			const { confirmed, onboardingDone, username, manager } = updateResult.data.updateAccount;

			$accountData = {
				...$accountData,
				confirmed,
				onboardingDone,
				username,
				manager,
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
		<h1>Création de mon compte Admin de territoire</h1>
		<p>
			Bienvenue sur Carnet de bord ! Pour cette première connexion, nous vous invitons à vérifier et
			mettre à jour les informations ci-dessous puis à cliquer sur le bouton "Créer mon compte".
			<br />
			Vous pourrez les modifier à nouveau plus tard en cliquant sur "Mon compte" dans la barre de menu.
		</p>
		<ManagerCreationForm
			onSubmit={handleSubmit}
			accountRequest={initialValues}
			submitLabel="Créer mon compte"
			hiddenFields={{ email: true }}
		/>
	{/if}
	{#if $updateResult?.data}
		<h1>Votre compte a été créé avec succès !</h1>
		<p>
			Bienvenue à bord !<br />
			Cliquez sur le bouton ci-dessous pour accéder à votre compte.
		</p>
		<div>
			<a class="fr-btn" href={homeForRole(RoleEnum.Manager)} title="Aller à l'accueil">
				Accéder à mon compte
			</a>
		</div>
	{:else if error}
		<div class="mb-8">
			<Alert type="error" description={error} />
		</div>
	{/if}
</div>
