<script lang="ts">
	import type {
		IdentifierCAF,
		ExternalUser,
		IdentifierPE,
		IdentifierType,
		Option,
	} from '$lib/types';
	import type { CreateBeneficiaryMutationStore } from '$lib/graphql/_gen/typed-document-nodes';
	import type { SvelteComponent } from 'svelte';

	import { session } from '$app/stores';
	import { Alert, Button, Radio } from '$lib/ui/base';
	import ProFormIdentifierPe from '$lib/ui/ProFormIdentifiers/ProFormIdentifierPE.svelte';
	import ProFormIdentifierCaf from '$lib/ui/ProFormIdentifiers/ProFormIdentifierCAF.svelte';
	import { displayFullName } from '$lib/ui/format';
	import * as RD from '$lib/remoteData';
	import { openComponent } from '$lib/stores';
	import { mutation } from '@urql/svelte';

	import Form from '$lib/ui/forms/Form.svelte';
	import ProBeneficiaryCreateFields from './ProBeneficiaryCreateFields.svelte';
	import { BeneficiaryAccountInput, beneficiaryAccountSchema } from './beneficiary.schema';

	const { professionalId } = $session.user;

	type ExternalUserOption = Option & { value: ExternalUser };

	const identifierTypeLabel = {
		CAF: 'CAF',
		PE: 'Pôle emploi',
	};

	let forms: Record<IdentifierCAF | IdentifierPE, typeof SvelteComponent> = {
		CAF: ProFormIdentifierCaf,
		PE: ProFormIdentifierPe,
	};

	let users: Record<IdentifierType, RD.RemoteData<ExternalUser[], string>> = {
		CAF: RD.notAsked,
		PE: RD.notAsked,
		NoIdentifier: RD.notAsked,
	};

	let identifierType: IdentifierType | null;

	let options: { name: IdentifierType; label: string }[] = [
		{
			name: 'CAF',
			label: "Je connais l'identifiant CAF/MSA du bénéficiaire.",
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

	let initialValues = {
		firstname: '',
		lastname: '',
		dateOfBirth: '',
		mobileNumber: '',
		email: '',
		address1: '',
		address2: '',
		postalCode: '',
		city: '',
	};

	export let createBeneficiaryResult: CreateBeneficiaryMutationStore;
	const createBeneficiaryMutation = mutation(createBeneficiaryResult);

	let username: string;
	let selectedUser: ExternalUser | null = null;
	let submissionSuccess = false;
	let submissionError = '';

	async function createBeneficiary(values: BeneficiaryAccountInput) {
		const members = [{ memberType: 'referent', professionalId }];
		const store = await createBeneficiaryMutation({
			...values,
			members,
		});

		if (store.error) {
			submissionError =
				"Une erreur s'est produite. Si le problème persiste, veuillez nous contacter.";
		} else {
			submissionSuccess = true;
		}
	}

	function clearSelectedUser() {
		selectedUser = null;
		users[identifierType] = RD.notAsked;
	}

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

	function initializeBeneficiaryAccount(event: CustomEvent<{ value: string }>) {
		selectedUser = userOptions.find(({ name }) => name === event.detail.value)?.value;
		const { mobileOrPhoneNumber: mobileNumber = '', email = '', ...accountInfo } = selectedUser;
		initialValues = {
			...accountInfo,
			email,
			mobileNumber,
		};
	}

	let userOptions: ExternalUserOption[] = [];

	$: {
		if (identifierType) {
			userOptions = (RD.getData(users[identifierType]) || []).map(externalUserToOption);
		}
	}

	type Step = 'NoSelection' | 'Step1' | 'Step2' | 'Step3' | 'FromScratch';
	let step: Step = 'NoSelection';
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
		<Form
			{initialValues}
			validationSchema={beneficiaryAccountSchema}
			onSubmit={createBeneficiary}
			let:isSubmitting
			let:isSubmitted
			let:isValid
		>
			<Radio
				caption="Connaissez-vous l’identifiant CAF/MSA ou Pôle emploi du bénéficiaire&nbsp;?"
				{options}
				bind:selected={identifierType}
				on:input={clearSelectedUser}
			/>
			{#if step !== 'NoSelection'}
				<hr class="mb-8" />
				{#if step === 'FromScratch'}
					<div class="font-bold mb-6">Veuillez renseigner les informations ci-dessous.</div>
					<ProBeneficiaryCreateFields />
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
							<Radio
								options={userOptions}
								bind:selected={username}
								on:input={initializeBeneficiaryAccount}
							/>
						{/key}
					{/if}
					<hr class="mb-8" />
					<div class={`font-bold mb-6 ${step !== 'Step3' ? 'opacity-60' : ''}`}>
						3. Valider les informations du profil
					</div>
					{#if step !== 'Step3'}
						<hr class="mb-8" />
					{:else}
						<ProBeneficiaryCreateFields />
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
					<Button type="submit" disabled={(isSubmitted && !isValid) || isSubmitting}>Valider</Button
					>
				{/if}
				<Button outline={true} on:click={openComponent.close}>Annuler</Button>
			</div>
		</Form>
	{/if}
</div>
