<script context="module" lang="ts">
	import { post } from '$lib/utils/post';
	import { account } from '$lib/../stores';
	import ProFormInfo from '$lib/ui/ProFormInfo.svelte';
	import type { Account, AccountRequest, RequestStep } from '$lib/types';
	import { Alert } from '$lib/ui/base';
</script>

<script lang="ts">
	let error: string | null;
	let result: RequestStep = 'start';
	let cleanedAccount: AccountRequest;

	async function handleSubmit() {
		if (result === 'start') {
			const response = await post(`/pro/moncompte`, { account: cleanedAccount });
			if ([401, 403].includes(response.status)) {
				const json = await response.json();
				error = json.errors || {};
				result = 'error';
			}
			if (response.status === 200) {
				result = 'success';
				const json = await response.json();
				const patch = json.patch;
				$account = { ...$account, ...patch, onboardingDone: true };
			}
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

	function getAlert(type: RequestStep) {
		switch (type) {
			case 'success':
				return { description: 'Modifications effectuées avec succès !', type: 'success' as const };
			case 'error':
				return {
					description: "Une erreur s'est produite, veuillez réessayer !",
					type: 'error' as const
				};
			case 'start':
			default:
				return {};
		}
	}

	const disabledKeys = {
		username: true,
		email: true
	};

	$: disableSubmission = !!error;
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
		{#if result !== 'start'}
			<Alert description={getAlert(result).description} type={getAlert(result).type} size="sm" />
		{/if}
		<div>
			<ProFormInfo
				on:submit={handleSubmit}
				on:cancel={handleCancel}
				account={cleanedAccount}
				confirmText="Je valide mes informations"
				disabled={disableSubmission}
				globalError={error}
				fieldErrors={{}}
				{disabledKeys}
				onInput={() => (result = 'start')}
			/>
		</div>
	{/if}
</div>
