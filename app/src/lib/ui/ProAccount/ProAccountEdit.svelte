<script lang="ts">
	import { UpdateProfessionalProfileDocument } from '$lib/graphql/_gen/typed-document-nodes';
	import type { UpdateProfessionalProfileMutation } from '$lib/graphql/_gen/typed-document-nodes';
	import ProCreationForm from '$lib/ui/ProCreationForm/index.svelte';
	import { type OperationStore, mutation, operationStore } from '@urql/svelte';
	import { accountData, openComponent } from '$lib/stores';
	import { Alert, Button } from '$lib/ui/base';
	import type { ProAccountInput } from '$lib/ui/ProCreationForm/pro.schema';

	import { formatNames } from '../format';

	const { id, email, firstname, lastname, position, mobileNumber } = $accountData.professional;

	const initialValues = {
		email,
		...formatNames({ firstname, lastname }),
		position,
		mobileNumber,
	};

	const updateProfileResult = operationStore(UpdateProfessionalProfileDocument);
	const updateProfile = mutation(updateProfileResult);
	let updateResult: OperationStore<UpdateProfessionalProfileMutation>;

	let error: string;

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
		<ProCreationForm
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
