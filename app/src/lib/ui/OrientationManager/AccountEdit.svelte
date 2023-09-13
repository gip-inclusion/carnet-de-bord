<script lang="ts">
	import { UpdateOrientationManagerProfileDocument } from '$lib/graphql/_gen/typed-document-nodes';
	import type { UpdateOrientationManagerProfileMutation } from '$lib/graphql/_gen/typed-document-nodes';
	import AdminStructureForm from '$lib/ui/AdminStructure/AdminStructureForm.svelte';
	import { type OperationStore, mutation, operationStore } from '@urql/svelte';
	import { accountData, openComponent } from '$lib/stores';
	import { Alert, Button } from '$lib/ui/base';
	import type { OrientationManagerAccountInput } from './orientationManager.schema';

	import { formatNames } from '../format';

	const { id, email, firstname, lastname, phoneNumbers } = $accountData.orientation_manager;

	const initialValues = {
		email,
		...formatNames({ firstname, lastname }),
		phoneNumbers,
	};

	const updateProfileResult = operationStore(UpdateOrientationManagerProfileDocument);
	const updateProfile = mutation(updateProfileResult);
	let updateResult: OperationStore<UpdateOrientationManagerProfileMutation>;

	let error: string;

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
				orientation_manager: orientation_manager,
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
