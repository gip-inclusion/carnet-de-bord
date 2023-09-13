<script lang="ts">
	import {
		RoleEnum,
		UpdateProfessionalProfileDocument,
		type UpdateProfessionalProfileMutation,
	} from '$lib/graphql/_gen/typed-document-nodes';
	import { homeForRole } from '$lib/routes';
	import { accountData } from '$lib/stores/account';
	import ProCreationForm from '$lib/ui/ProCreationForm/index.svelte';
	import type { ProAccountInput } from '$lib/ui/ProCreationForm/pro.schema';
	import { Alert } from '$lib/ui/base';
	import { formatNames } from '$lib/ui/format';
	import { mutation, operationStore, type OperationStore } from '@urql/svelte';

	const updateProfileResult = operationStore(UpdateProfessionalProfileDocument);
	const updateProfile = mutation(updateProfileResult);
	let updateResult: OperationStore<UpdateProfessionalProfileMutation>;

	let error: string;

	const { id, email, firstname, lastname, mobileNumber, position } = $accountData.professional;

	const initialValues = {
		email,
		...formatNames({ firstname, lastname }),
		mobileNumber,
		position,
	};

	async function handleSubmit(values: ProAccountInput) {
		updateResult = await updateProfile({
			id,
			accountId: $accountData.id,
			...values,
		});

		if (updateResult.data?.updateAccount) {
			const { confirmed, onboardingDone, username, professional } = updateResult.data.updateAccount;

			$accountData = {
				...$accountData,
				confirmed,
				onboardingDone,
				username,
				professional: {
					...professional,
					structure: $accountData.professional.structure,
				},
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
		<h1>Création de mon compte professionnel</h1>
		<p>
			Bienvenue sur Carnet de bord ! Pour cette première connexion, nous vous invitons à vérifier et
			mettre à jour les informations ci-dessous puis à cliquer sur le bouton "Créer mon compte".
			<br />
			Vous pourrez les modifier à nouveau plus tard en cliquant sur "Mon compte" dans la barre de menu.
		</p>
		<ProCreationForm
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
			<a class="fr-btn" href={homeForRole(RoleEnum.Professional)} title="Aller à l'accueil">
				Accéder à mon compte
			</a>
		</div>
	{:else if error}
		<div class="mb-8">
			<Alert type="error" description={error} />
		</div>
	{/if}
</div>
