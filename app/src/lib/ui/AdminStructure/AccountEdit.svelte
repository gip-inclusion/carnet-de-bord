<script lang="ts">
	import { UpdateAdminStructureProfileDocument } from '$lib/graphql/_gen/typed-document-nodes';
	import type { UpdateAdminStructureProfileMutation } from '$lib/graphql/_gen/typed-document-nodes';
	import AdminStructureForm from '$lib/ui/AdminStructure/AdminStructureForm.svelte';
	import { type OperationStore, mutation, operationStore } from '@urql/svelte';
	import { accountData, openComponent } from '$lib/stores';
	import { Alert, Button } from '$lib/ui/base';
	import type { AdminStructureAccountInput } from './adminStructure.schema';
	import { formatNames } from '../format';

	const { id, email, firstname, lastname, phoneNumbers } = $accountData.admin_structure;

	const initialValues = {
		email,
		...formatNames({ firstname, lastname }),
		phoneNumbers,
	};

	const updateProfileResult = operationStore(UpdateAdminStructureProfileDocument);
	const updateProfile = mutation(updateProfileResult);
	let updateResult: OperationStore<UpdateAdminStructureProfileMutation>;

	let error: string;

	async function handleSubmit(values: AdminStructureAccountInput) {
		updateResult = await updateProfile({
			id,
			accountId: $accountData.id,
			...values,
		});

		if (updateResult.data?.updateAccount) {
			const { confirmed, onboardingDone, username, admin_structure } =
				updateResult.data.updateAccount;

			$accountData = {
				...$accountData,
				confirmed,
				onboardingDone,
				username,
				admin_structure,
			};
		}
		if (updateResult.error) {
			error = "L'enregistrement a échoué.";
		}
	}

	function onCancel() {
		openComponent.close();
	}

	const hiddenFields = { email: true };
</script>

<div class="flex flex-col gap-4">
	<h1>Mettre à jour mon compte</h1>

	{#if $updateResult?.data}
		<p>Votre compte a été modifié avec succès !</p>
		<div><Button on:click={openComponent.close}>J'ai compris</Button></div>
	{:else}
		<AdminStructureForm
			onSubmit={handleSubmit}
			{onCancel}
			{initialValues}
			submitLabel="Mettre à jour"
			{hiddenFields}
		/>
		{#if error}
			<div class="mb-8">
				<Alert type="error" description={error} />
			</div>
		{/if}
	{/if}
</div>
