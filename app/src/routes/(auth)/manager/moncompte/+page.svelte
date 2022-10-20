<script lang="ts">
	import type { GetAccountByPkQuery } from '$lib/graphql/_gen/typed-document-nodes';
	import { GetAccountByPkDocument } from '$lib/graphql/_gen/typed-document-nodes';
	import { operationStore, query } from '@urql/svelte';
	import { connectedUser } from '$lib/stores';
	import { account, openComponent } from '$lib/stores';
	import ManagerAccountEdit from '$lib/ui/Manager/AccountEdit.svelte';
	import ManagerView from '$lib/ui/Manager/View.svelte';
	import { Button } from '$lib/ui/base';

	let manager: GetAccountByPkQuery['account_by_pk']['manager'];
	const getAccountStore = operationStore(GetAccountByPkDocument, { accountId: $connectedUser?.id });
	query(getAccountStore);

	$: manager = $getAccountStore?.data?.account_by_pk?.manager;
	function editAccount() {
		openComponent.open({
			component: ManagerAccountEdit,
			props: { manager },
		});
	}
</script>

<svelte:head>
	<title>Mon compte - Carnet de bord</title>
</svelte:head>

{#if $account}
	<h1 class="fr-h2">
		{$account.onboardingDone ? 'Mon compte' : 'Première connexion à Carnet de bord'}
	</h1>
	{#if !$account.onboardingDone}
		<p>
			Bienvenue sur Carnet de bord ! Pour cette première connexion, nous vous invitons à vérifier et
			mettre à jour les informations ci-dessous en cliquant sur le bouton "Mettre à jour".
			<br />
			Vous pourrez les modifier à nouveau plus tard en cliquant sur "Mon compte" dans la barre de menu.
		</p>
	{/if}
	{#if manager}
		<ManagerView {manager} />
	{/if}
	<div>
		<Button on:click={editAccount} outline={true}>Mettre à jour</Button>
	</div>
{/if}
