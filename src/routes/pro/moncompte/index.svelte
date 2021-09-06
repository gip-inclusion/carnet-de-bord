<script context="module" lang="ts">
	import ProFormInfo from '$lib/ui/ProFormInfo.svelte';

	import type { UpdateProfessionalProfileMutationStore } from '$lib/graphql/_gen/typed-document-nodes';
	import { UpdateProfessionalProfileDocument } from '$lib/graphql/_gen/typed-document-nodes';
	import { mutation, operationStore } from '@urql/svelte';
	import type { Load } from '@sveltejs/kit';

	export const load: Load = async ({ session }) => {
		const { professionalId } = session.user;

		const updateProfileResult = operationStore(UpdateProfessionalProfileDocument);
		return {
			props: {
				updateProfileResult,
				professionalId
			}
		};
	};
</script>

<script lang="ts">
	import AlertRequestResponse from '$lib/ui/utils/AlertRequestResponse.svelte';
	import type { Account, AccountRequest } from '$lib/types';
	import { account } from '$lib/stores';

	export let professionalId: string;
	export let updateProfileResult: UpdateProfessionalProfileMutationStore;

	let cleanedAccount: AccountRequest;

	const updateProfile = mutation(updateProfileResult);

	async function handleSubmit() {
		const { firstname, lastname, mobileNumber, position } = cleanedAccount;
		const result = await updateProfile({
			firstname,
			lastname,
			professionalId,
			mobileNumber,
			position
		});
		if (result.data?.updateAccount) {
			const { confirmed, onboardingDone, username, professional } =
				result.data.updateAccount.returning[0];
			$account = {
				confirmed,
				onboardingDone,
				username,
				...professional
			};
			document.querySelector('h1').scrollIntoView({ behavior: 'smooth' });
		}
	}

	function handleCancel() {
		cleanedAccount = cleanAccount($account);
	}

	function cleanAccount(acc: Account): AccountRequest | null {
		if ($account) {
			const { onboardingDone, confirmed, ...cleaned } = acc;
			return cleaned;
		} else {
			return null;
		}
	}

	$: onboardingDone = $account && $account.onboardingDone;
	$: cleanedAccount = cleanAccount($account);
</script>

<div class="flex flex-col space-y-8 px-40">
	{#if cleanedAccount}
		<h1 class="fr-h2">
			{onboardingDone ? 'Mon compte' : 'Première connexion à Carnet de bord'}
		</h1>
		{#if !onboardingDone}
			<p>
				Bienvenue sur Carnet de bord ! Pour cette première connexion, nous vous invitons à vérifier
				et mettre à jour les informations ci-dessous.
				<br />
				Vous pourrez les modifier à nouveau plus tard en cliquant sur "Mon compte" dans la barre de menu.
			</p>
		{/if}
		<AlertRequestResponse operationStore={updateProfileResult} />
		<div>
			<ProFormInfo
				on:submit={handleSubmit}
				on:cancel={handleCancel}
				account={cleanedAccount}
				confirmText="Je valide mes informations"
				disabled={false}
				fieldErrors={{}}
				disabledKeys={{
					username: true,
					email: true
				}}
			/>
		</div>
	{/if}
</div>
