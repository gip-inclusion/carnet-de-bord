<script lang="ts">
	import { UpdateManagerProfileDocument } from '$lib/graphql/_gen/typed-document-nodes';
	import type {
		Manager,
		UpdateManagerProfileMutation,
	} from '$lib/graphql/_gen/typed-document-nodes';
	import ManagerCreationForm from '$lib/ui/ManagerCreationForm/index.svelte';
	import { mutation, OperationStore, operationStore } from '@urql/svelte';
	import { account, openComponent } from '$lib/stores';
	import { Button } from '$lib/ui/base';
	import Alert from '$lib/ui/base/Alert.svelte';
	import type { ManagerAccountInput } from '$lib/ui/ManagerCreationForm/manager.schema';

	export let manager: Manager;
	let { email, firstname, lastname } = manager;
	let initialValues = {
		email,
		firstname,
		lastname,
	};

	const updateProfileResult = operationStore(UpdateManagerProfileDocument);
	const updateProfile = mutation(updateProfileResult);
	let updateResult: OperationStore<UpdateManagerProfileMutation>;

	let error: string;

	async function handleSubmit(values: ManagerAccountInput) {
		updateResult = await updateProfile({
			managerId: manager.id,
			...values,
		});

		if (updateResult.data?.updateAccount) {
			const { confirmed, onboardingDone, username, manager } =
				updateResult.data.updateAccount.returning[0];
			$account = {
				confirmed,
				onboardingDone,
				username,
				...manager,
			};
		}
		if (updateResult.error) {
			error = "L'enregistrement a échoué.";
		}
	}

	function onCancel() {
		openComponent.close();
	}
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
		/>
		{#if error}
			<div class="mb-8">
				<Alert type="error" description={error} />
			</div>
		{/if}
	{/if}
</div>
