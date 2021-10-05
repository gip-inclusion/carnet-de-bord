<script lang="ts">
	import Svelecte from 'svelecte';
	import type { AccountRequest } from '$lib/types';
	import {
		GetStructuresDocument,
		GetStructuresQuery,
		Professional,
		UpdateProfessionalProfileDocument,
		UpdateProfessionalProfileMutation,
	} from '$lib/graphql/_gen/typed-document-nodes';
	import ProFormInfo from '$lib/ui/ProFormInfo.svelte';
	import { mutation, OperationStore, operationStore, query } from '@urql/svelte';
	import { contactEmail } from '$lib/constants';
	import { account, openComponent } from '$lib/stores';
	import { Button } from '$lib/ui/base';

	export let professional: Professional | null;

	const updateProfileResult = operationStore(UpdateProfessionalProfileDocument);
	const updateProfile = mutation(updateProfileResult);

	let updateResult: OperationStore<UpdateProfessionalProfileMutation>;
	let result: OperationStore<GetStructuresQuery> = operationStore(GetStructuresDocument, {});
	query(result);

	let options: { id: string }[];
	let { firstname, lastname, mobileNumber, position, email, structure } = professional || {};
	let structureId: string = structure?.id;
	let selection: { id: string };
	let acc = { firstname, lastname, mobileNumber, position, email };
	$: {
		options = $result?.data?.structure || [];
		if (!selection) {
			selection = options.filter(({ id }) => {
				return id === structureId;
			})[0];
		}
	}

	async function handleSubmit(event: CustomEvent<{ account: AccountRequest }>) {
		const ac = event.detail?.account;
		const { firstname, lastname, mobileNumber, position } = ac;
		updateResult = await updateProfile({
			firstname,
			lastname,
			professionalId: professional?.id,
			mobileNumber,
			position,
			structureId: selection?.id,
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
	}
</script>

<div class="flex flex-col gap-4">
	{#if $updateResult?.data}
		<h1>Mettre à jour mon compte</h1>
		<p>Votre compte a été modifié avec succès !</p>
		<div><Button on:click={openComponent.close}>J'ai compris</Button></div>
	{:else}
		<h1>Mettre à jour mon compte</h1>

		<h2 class="text-france-blue fr-h4">Structure</h2>
		<div class="flex flex-row w-full gap-2">
			<div class="w-full">
				<label class="flex-grow mb-2 fr-label" for="structureSelect">
					<div>Sélectionnez votre structure</div>
					<span class="fr-hint-text justify-self-stretch">
						Si vous ne trouvez pas votre structure, veuillez <a href="mailto:${contactEmail}"
							>nous contacter</a
						>.
					</span>
				</label>
				<Svelecte
					name="structureSelect"
					{options}
					placeholder=""
					bind:selection
					disableSifter={false}
					class="svelecte-control custom-svelecte"
					valueField="id"
					labelField="name"
					clearable={true}
				/>
			</div>
		</div>

		<h2 class="text-france-blue fr-h4">Informations personnelles</h2>
		<ProFormInfo account={acc} fieldErrors={{}} disabled={false} on:submit={handleSubmit} />
	{/if}
</div>
