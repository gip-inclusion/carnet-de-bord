<script context="module" lang="ts">
	import type { GetAccountByPkQuery } from '$lib/graphql/_gen/typed-document-nodes';
	import { GetAccountByPkDocument } from '$lib/graphql/_gen/typed-document-nodes';
	import { operationStore, query } from '@urql/svelte';
</script>

<script lang="ts">
	import { session } from '$app/stores';
	import { account, openComponent } from '$lib/stores';
	import AdminStructureAccountEdit from '$lib/ui/AdminStructureAccount/AdminStructureAccountEdit.svelte';
	import AdminStructureView from '$lib/ui/AdminStructureView.svelte';
	import { Button } from '$lib/ui/base';

	let adminStructure: GetAccountByPkQuery['account_by_pk']['admin_structure'];
	const getAccountStore = operationStore(GetAccountByPkDocument, { accountId: $session?.user?.id });
	query(getAccountStore);

	$: adminStructure = $getAccountStore?.data?.account_by_pk?.admin_structure;
	function editAccount() {
		openComponent.open({
			component: AdminStructureAccountEdit,
			props: { adminStructure },
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
	{#if adminStructure}
		<AdminStructureView {adminStructure} />
	{/if}
	<div>
		<Button on:click={editAccount} outline={true}>Mettre à jour</Button>
	</div>
{/if}
