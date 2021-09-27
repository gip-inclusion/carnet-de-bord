<script context="module" lang="ts">
	import type { IdentifierCAF, IdentifierPE, IdentifierType, Option } from '$lib/types';
	import type { BeneficiaryAccount, ExternalUser } from '$lib/types';
	import type { CreateBeneficiaryMutationStore } from '$lib/graphql/_gen/typed-document-nodes';
	import type { SvelteComponent } from 'svelte';
	import { Alert, Button, Radio } from '$lib/ui/base';
	import ProFormIdentifierPe from '$lib/ui/ProFormIdentifiers/ProFormIdentifierPE.svelte';
	import ProFormIdentifierCaf from '$lib/ui/ProFormIdentifiers/ProFormIdentifierCAF.svelte';
	import BeneficiaryCreateForm from './ProBeneficiaryCreateForm.svelte';
	import { displayFullName, notNullish } from '$lib/ui/format';
	import * as RD from '$lib/remoteData';
</script>

<script lang="ts">
	import { session } from '$app/stores';
	import { mutation } from '@urql/svelte';
	import { openComponent } from '$lib/stores';
	const { professionalId } = $session.user;

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

	const identifierTypeLabel = {
		CAF: 'CAF',
		PE: 'Pôle emploi',
	};

	let identifierType: IdentifierType | null;
	let errors: Partial<BeneficiaryAccount>;

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
				submissionError =
					"Une erreur s'est produite. Si le problème persiste, veuillez nous contacter.";
			} else {
				submissionSuccess = true;
			}
		}
	}

	function clearSelectedUser() {
		selectedUser = null;
		beneficiaryAccount = {};
	}

	let selectedUser: ExternalUser | null = null;
	let beneficiaryAccount: BeneficiaryAccount | null = {};
	let submissionSuccess = false;
	let submissionError = '';
	type Step = 'NoSelection' | 'Step1' | 'Step2' | 'Step3' | 'FromScratch';
	let step: Step = 'NoSelection';

	function isAccountValid(acc: BeneficiaryAccount | null) {
		errors = {};

		['firstname', 'lastname', 'dateOfBirth'].forEach((key) => {
			errors[key] = acc[key] ? '' : 'Ce champ est obligatoire';
		});
		return Object.values(errors).filter(notNullish).length === 0;
	}

	const onInput = (key: string) => () => {
		errors[key] = '';
	};

	type ExternalUserOption = Option & { value: ExternalUser };

	let forms: Record<IdentifierCAF | IdentifierPE, typeof SvelteComponent> = {
		CAF: ProFormIdentifierCaf,
		PE: ProFormIdentifierPe,
	};

	let users: Record<IdentifierType, RD.RemoteData<ExternalUser[], string>> = {
		CAF: RD.notAsked,
		PE: RD.notAsked,
		NoIdentifier: RD.notAsked,
	};

	let username: string;

	function externalUserToOption(externalUser: ExternalUser): ExternalUserOption {
		return {
			value: externalUser,
			label: `${displayFullName(externalUser)} (${externalUser.dateOfBirth})  ${
				externalUser.mobileOrPhoneNumber ? ` - ${externalUser.mobileOrPhoneNumber}` : ''
			}`,
			name: [
				externalUser.firstname,
				externalUser.lastname,
				externalUser.dateOfBirth,
				externalUser.mobileOrPhoneNumber,
			]
				.filter(Boolean)
				.join('-'),
		};
	}

	let userOptions: ExternalUserOption[] = [];
	$: {
		if (identifierType) {
			userOptions = (RD.getData(users[identifierType]) || []).map(externalUserToOption);
		}
	}
	$: {
		selectedUser = userOptions.find(({ name }) => name === username)?.value;
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
	$: {
		if (!identifierType) {
			step = 'NoSelection';
		} else if (identifierType === 'NoIdentifier') {
			step = 'FromScratch';
		} else if (userOptions.length === 0) {
			step = 'Step1';
		} else if (!selectedUser) {
			step = 'Step2';
		} else {
			step = 'Step3';
		}
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
				bind:selected={identifierType}
				on:selectedItem={clearSelectedUser}
			/>

			{#if step !== 'NoSelection'}
				<hr class="mb-8" />
				{#if step === 'FromScratch'}
					<div class="font-bold mb-6">Veuillez renseigner les informations ci-dessous.</div>
					<BeneficiaryCreateForm bind:beneficiaryAccount {errors} {onInput} />
				{:else}
					<div class={`font-bold mb-6 ${step !== 'Step1' ? 'opacity-60' : ''}`}>
						1. Rechercher un profil avec l'identifiant {identifierTypeLabel[identifierType]}
					</div>
					{#if step === 'Step1'}
						<svelte:component this={forms[identifierType]} bind:users={users[identifierType]} />
					{/if}
					<hr class="mb-8" />
					<div class={`font-bold mb-6 ${step !== 'Step2' ? 'opacity-60' : ''}`}>
						2. Sélectionner un profil
					</div>
					{#if step === 'Step2'}
						{#key identifierType}
							<Radio options={userOptions} bind:selected={username} />
						{/key}
					{/if}
					<hr class="mb-8" />
					<div class={`font-bold mb-6 ${step !== 'Step3' ? 'opacity-60' : ''}`}>
						3. Valider les informations du profil
					</div>
					{#if step !== 'Step3'}
						<hr class="mb-8" />
					{:else}
						<BeneficiaryCreateForm bind:beneficiaryAccount {errors} {onInput} />
					{/if}
				{/if}
			{/if}

			{#if submissionError}
				<div class="mb-8">
					<Alert type="error" description={submissionError} />
				</div>
			{/if}
			<div class="flex flex-row gap-6">
				{#if ['FromScratch', 'Step3'].includes(step)}
					<Button on:click={handleSubmit}>Valider</Button>
				{/if}
				<Button outline={true} on:click={openComponent.close}>Annuler</Button>
			</div>
		</form>
	{/if}
</div>
