<script lang="ts">
	import { UpdateAdminStructureProfileDocument } from '$lib/graphql/_gen/typed-document-nodes';
	import type {
		AdminStructure,
		UpdateAdminStructureProfileMutation,
	} from '$lib/graphql/_gen/typed-document-nodes';
	import AdminStructureCreationForm from '$lib/ui/AdminStructureCreationForm/index.svelte';
	import { mutation, OperationStore, operationStore } from '@urql/svelte';
	import { account, openComponent } from '$lib/stores';
	import { Button } from '$lib/ui/base';
	import Alert from '$lib/ui/base/Alert.svelte';
	import type { AdminStructureAccountInput } from '$lib/ui/AdminStructureCreationForm/adminStructure.schema';

	export let adminStructure: AdminStructure;
	let { email, firstname, lastname, phoneNumbers } = adminStructure;
	let initialValues = {
		email,
		firstname,
		lastname,
		phoneNumbers,
	};

	const updateProfileResult = operationStore(UpdateAdminStructureProfileDocument);
	const updateProfile = mutation(updateProfileResult);
	let updateResult: OperationStore<UpdateAdminStructureProfileMutation>;

	let error: string;

	async function handleSubmit(values: AdminStructureAccountInput) {
		updateResult = await updateProfile({
			adminStructureId: adminStructure.id,
			...values,
		});

		if (updateResult.data?.updateAccount) {
			const { confirmed, onboardingDone, username, admin_structure } =
				updateResult.data.updateAccount.returning[0];
			$account = {
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
		<AdminStructureCreationForm
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
