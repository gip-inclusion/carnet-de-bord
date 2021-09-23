<script context="module" lang="ts">
	import type { IdentifierType } from '$lib/types';
	import { Alert, Button, Radio } from '$lib/ui/base';
	import { ProFormIdentifiers } from '$lib/ui';
	import type { BeneficiaryAccount, ExternalUser } from '$lib/types';
	import type { CreateBeneficiaryMutationStore } from '$lib/graphql/_gen/typed-document-nodes';
</script>

<script lang="ts">
	import { session } from '$app/stores';
	const { professionalId } = $session.user;
	import { mutation } from '@urql/svelte';
	import BeneficiaryCreateForm from './ProBeneficiaryCreateForm.svelte';
	import { openComponent } from '$lib/stores';

	let options: { name: IdentifierType; label: string }[] = [
		{
			name: 'CAF',
			label: "Je connais l'identifiant CAF du bénéficiaire.",
		},
		{
			name: 'PE',
			label: "Je connais l'identifiant Pôle emploi du bénéficiaire.",
		},
		{
			name: 'NoIdentifier',
			label: 'Je ne connais pas les identifiants bénéficiaire.',
		},
	];

	let selected: IdentifierType | null;

	export let createBeneficiaryResult: CreateBeneficiaryMutationStore;
	const createBeneficiary = mutation(createBeneficiaryResult);

	async function handleSubmit() {
		if (isAccountValid(beneficiaryAccount)) {
			const store = await createBeneficiary({
				...beneficiaryAccount,
				dateOfBirth: new Date(beneficiaryAccount.dateOfBirth),
				professionalId,
			});

			if (store.error) {
				submissionError = `Une erreur s'est produite : ${store.error}`;
			} else {
				submissionSuccess = true;
			}
		}
	}

	function handleUserSelection(event: CustomEvent<ExternalUser>) {
		selectedUser = event.detail;
		if (selectedUser) {
			let { mobileOrPhoneNumber, ...info } = selectedUser;
			beneficiaryAccount = {
				...info,
				mobileNumber: mobileOrPhoneNumber,
			};
		} else {
			beneficiaryAccount = {};
		}
	}

	function clearSelectedUser() {
		selectedUser = null;
	}

	let selectedUser: ExternalUser | null = null;
	let beneficiaryAccount: BeneficiaryAccount | null = {};
	let submissionSuccess = false;
	let submissionError = '';

	function isAccountValid(acc: BeneficiaryAccount | null) {
		return (
			acc.firstname &&
			acc.lastname &&
			acc.dateOfBirth &&
			acc.address1 &&
			acc.postalCode &&
			acc.city &&
			acc.workSituation
		);
	}
</script>

<div>
	{#if submissionSuccess}
		<h2 role="status">Demande d'ajout d'un nouveau bénéficiaire envoyée !</h2>
		<p>
			Nous avons bien pris en compte votre demande. Vous retrouverez ce bénéficiaire dans votre
			annuaire dans les plus brefs délai.
		</p>
		<Button on:click={openComponent.close}>J'ai compris</Button>
	{:else}
		<h2>Ajouter un bénéficiaire</h2>
		<form on:submit|preventDefault={handleSubmit} class="flex flex-col">
			<Radio
				caption="Connaissez-vous l’identifiant CAF ou Pôle emploi du bénéficiaire&nbsp;?"
				{options}
				bind:selected
				on:selectedItem={clearSelectedUser}
			/>

			{#if selected}<hr class="mb-8" />{/if}

			<ProFormIdentifiers identifierType={selected} on:selectedUser={handleUserSelection} />
			{#if selected === 'NoIdentifier' || selectedUser}
				<div class="font-bold mb-6">Veuillez renseigner les informations ci-dessous.</div>
				<BeneficiaryCreateForm bind:beneficiaryAccount />
			{/if}
			{#if submissionError}
				<div class="mb-8">
					<Alert type="error" description={submissionError} />
				</div>
			{/if}
			<div class="flex flex-row gap-6">
				<Button
					on:click={handleSubmit}
					disabled={!selected || !beneficiaryAccount || !isAccountValid(beneficiaryAccount)}
					>Valider</Button
				>
				<Button outline={true} on:click={openComponent.close}>Annuler</Button>
			</div>
		</form>
	{/if}
</div>
