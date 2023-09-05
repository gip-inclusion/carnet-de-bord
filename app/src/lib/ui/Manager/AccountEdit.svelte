<script lang="ts">
	import { UpdateManagerProfileDocument } from '$lib/graphql/_gen/typed-document-nodes';
	import type { UpdateManagerProfileMutation } from '$lib/graphql/_gen/typed-document-nodes';
	import ManagerCreationForm from '$lib/ui/Manager/CreationForm.svelte';
	import { type OperationStore, mutation, operationStore } from '@urql/svelte';
	import { openComponent } from '$lib/stores';
	import { Alert, Button } from '$lib/ui/base';
	import type { ManagerAccountInput } from './manager.schema';
	import { accountData } from '$lib/stores/account';
	import { formatNames } from '../format';

	const { id, email, firstname, lastname } = $accountData.manager;

	const initialValues = {
		email,
		...formatNames({ firstname, lastname }),
	};

	const updateProfileResult = operationStore(UpdateManagerProfileDocument);
	const updateProfile = mutation(updateProfileResult);
	let updateResult: OperationStore<UpdateManagerProfileMutation>;

	let error: string;

	async function handleSubmit(values: ManagerAccountInput) {
		updateResult = await updateProfile({
			id: id,
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
				manager: manager,
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
	{#if $updateResult?.data}
		<h1>Mettre à jour mon compte</h1>
		<p>Votre compte a été modifié avec succès !</p>
		<div><Button on:click={openComponent.close}>J'ai compris</Button></div>
	{:else}
		<h1>Mettre à jour mon compte</h1>
		<ManagerCreationForm
			onSubmit={handleSubmit}
			{onCancel}
			accountRequest={initialValues}
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
