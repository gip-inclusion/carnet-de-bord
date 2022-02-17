<script lang="ts">
	import { account } from '$lib/stores/account';
	import AdminStructureCreationForm from '$lib/ui/AdminStructureCreationForm/index.svelte';

	import {
		UpdateAdminStructureProfileDocument,
		UpdateAdminStructureProfileMutation,
	} from '$lib/graphql/_gen/typed-document-nodes';
	import { mutation, operationStore, OperationStore } from '@urql/svelte';
	import { homeForRole } from '$lib/routes';
	import Alert from '$lib/ui/base/Alert.svelte';
	import type { AdminStructureAccountInput } from '$lib/ui/AdminStructureCreationForm/adminStructure.schema';

	const updateProfileResult = operationStore(UpdateAdminStructureProfileDocument);
	const updateProfile = mutation(updateProfileResult);
	let updateResult: OperationStore<UpdateAdminStructureProfileMutation>;

	let error: string;

	let { id, accountId, email, firstname, lastname } = $account;

	let phoneNumbers: string | undefined;

	if ($account.type === 'adminStructure') {
		phoneNumbers = $account.phoneNumbers;
	}

	let initialValues = {
		email,
		firstname,
		lastname,
		phoneNumbers,
	};

	async function handleSubmit(values: AdminStructureAccountInput) {
		updateResult = await updateProfile({
			id,
			accountId,
			...values,
		});

		if (updateResult.data?.updateAccount) {
			const { confirmed, onboardingDone, username, admin_structure } =
				updateResult.data.updateAccount;

			$account = {
				...$account,
				confirmed,
				onboardingDone,
				username,
				...admin_structure,
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
		<h1>Création de mon compte Gestionnaire de structure</h1>
		<p>
			Vous avez été invité(e) à créer votre compte de Gestionnaire de structures.
			<br />Il ne reste plus que quelques étapes pour accéder à tous les services proposés !
		</p>
		<AdminStructureCreationForm
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
			<a class="fr-btn" href={`${homeForRole('admin_structure')}`} title="Aller à l'accueil">
				Accéder à mon compte
			</a>
		</div>
	{:else if error}
		<div class="mb-8">
			<Alert type="error" description={error} />
		</div>
	{/if}
</div>
