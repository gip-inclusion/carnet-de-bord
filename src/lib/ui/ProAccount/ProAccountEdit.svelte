<script lang="ts">
	import {
		Professional,
		UpdateProfessionalProfileDocument,
		UpdateProfessionalProfileMutation,
	} from '$lib/graphql/_gen/typed-document-nodes';
	import ProCreationForm from '$lib/ui/ProCreationForm/index.svelte';
	import { mutation, OperationStore, operationStore } from '@urql/svelte';
	import { account, openComponent } from '$lib/stores';
	import { Button } from '$lib/ui/base';
	import Alert from '$lib/ui/base/Alert.svelte';
	import type { ProAccountWithStructureInput } from '$lib/ui/ProCreationForm/pro.schema';

	export let professional: Professional | null;
	let { email, firstname, lastname, position, mobileNumber } = professional;
	let initialValues = {
		email,
		firstname,
		lastname,
		position,
		mobileNumber,
		structureId: professional.structure.id,
	};

	const updateProfileResult = operationStore(UpdateProfessionalProfileDocument);
	const updateProfile = mutation(updateProfileResult);
	let updateResult: OperationStore<UpdateProfessionalProfileMutation>;

	let error;

	async function handleSubmit(values: ProAccountWithStructureInput) {
		updateResult = await updateProfile({
			professionalId: professional.id,
			...values,
		});

		if (updateResult.data?.updateAccount) {
			const { confirmed, onboardingDone, username, professional } =
				updateResult.data.updateAccount.returning[0];
			$account = {
				confirmed,
				onboardingDone,
				username,
				...professional,
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
		<ProCreationForm
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
