<script context="module" lang="ts">
	import type { IdentifierType } from '$lib/ui/base/types';
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

	export let isOpen: boolean;
	export let close: () => void;
	let options: { name: IdentifierType; label: string }[] = [
		{
			name: 'CAF',
			label: "Je connais l'identifiant CAF du bénéficiaire."
		},
		{
			name: 'PE',
			label: "Je connais l'identifiant Pôle emploi du bénéficiaire."
		},
		{
			name: 'NoIdentifier',
			label: 'Je ne connais pas les identifiants bénéficiaire.'
		}
	];

	let selected: { name: IdentifierType; label: string } | null;

	export let createBeneficiaryResult: CreateBeneficiaryMutationStore;
	const createBeneficiary = mutation(createBeneficiaryResult);

	async function handleSubmit() {
		if (isAccountValid(beneficiaryAccount)) {
			const store = await createBeneficiary({
				...beneficiaryAccount,
				dateOfBirth: new Date(beneficiaryAccount.dateOfBirth),
				professionalId
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
		let { mobileOrPhoneNumber, ...info } = selectedUser;
		beneficiaryAccount = {
			...info,
			mobileNumber: mobileOrPhoneNumber
		};
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
			acc.cerObjects &&
			acc.rights &&
			acc.workSituations
		);
	}
</script>

{#if isOpen}
	<div on:click={close} class="!m-0 z-10 fixed inset-0 transition-opacity">
		<div class="absolute inset-0 bg-black opacity-50" tabindex="0" />
	</div>
{/if}
<div
	class="!m-0 transform top-0 right-0 w-1/2 bg-white fixed h-full overflow-auto ease-in-out transition-all duration-300 z-30 overscroll-contain {isOpen
		? 'translate-x-0'
		: 'translate-x-full'}"
>
	<div class="my-32 px-8">
		{#if submissionSuccess}
			<h2 role="status">Demande d'ajout d'un nouveau bénéficiaire envoyée !</h2>
			<p>
				Nous avons bien pris en compte votre demande. Vous retrouverez ce bénéficiaire dans votre
				annuaire dans les plus brefs délai.
			</p>
			<Button on:click={close}>J'ai compris</Button>
		{:else}
			<h2>Ajouter un bénéficiaire</h2>
			<form on:submit|preventDefault={handleSubmit} class="flex flex-col">
				<Radio
					caption="Connaissez-vous l’identifiant CAF ou Pôle emploi du bénéficiaire?"
					{options}
					bind:selected
					on:selectedItem={clearSelectedUser}
				/>

				{#if selected}<hr class="mb-8" />{/if}

				<ProFormIdentifiers
					identifierType={selected ? selected.name : null}
					on:selectedUser={handleUserSelection}
				/>
				{#if (selected && selected.name === 'NoIdentifier') || selectedUser}
					<div class="font-bold mb-6">Veuillez renseigner les informations ci-dessous.</div>
					<BeneficiaryCreateForm bind:beneficiaryAccount />
				{/if}
				{#if submissionError}
					<div class="mb-8">
						<Alert type="error" description={submissionError} />
					</div>
				{/if}
				<div class="flex flex-row gap-4">
					<Button
						on:click={handleSubmit}
						disabled={!selected || !beneficiaryAccount || !isAccountValid(beneficiaryAccount)}
						>Valider</Button
					>
					<Button outline={true} on:click={close}>Annuler</Button>
				</div>
			</form>
		{/if}
	</div>
</div>
