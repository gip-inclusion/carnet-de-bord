<script context="module" lang="ts">
	import { GetAccountDocument, Professional } from '$lib/graphql/_gen/typed-document-nodes';
	import { operationStore, query } from '@urql/svelte';
</script>

<script lang="ts">
	import { account, openComponent } from '$lib/stores';
	import ProAccountEdit from '$lib/ui/ProAccount/ProAccountEdit.svelte';
	import ProWithStructureView from '$lib/ui/ProNotebookMember/ProWithStructureView.svelte';
	import { Button } from '$lib/ui/base';

	const variables = { accountId: $account?.id };
	const getAccountStore = operationStore(GetAccountDocument, variables);
	query(getAccountStore);

	$: acc = $getAccountStore?.data?.account_by_pk;

	$: professional = acc?.professional as Professional | null;
	function editAccount() {
		openComponent.open({
			component: ProAccountEdit,
			props: { professional: professional },
		});
	}
</script>

<svelte:head>
	<title>Mon compte - carnet de bord</title>
</svelte:head>

<div class="flex flex-col space-y-8 px-40">
	{#if $account}
		<h1 class="fr-h2">
			{$account.onboardingDone ? 'Mon compte' : 'Première connexion à Carnet de bord'}
		</h1>
		{#if !$account.onboardingDone}
			<p>
				Bienvenue sur Carnet de bord ! Pour cette première connexion, nous vous invitons à vérifier
				et mettre à jour les informations ci-dessous en cliquant sur le bouton "Mettre à jour".
				<br />
				Vous pourrez les modifier à nouveau plus tard en cliquant sur "Mon compte" dans la barre de menu.
			</p>
		{/if}
		<ProWithStructureView
			{professional}
			proFirst={true}
			mainTitle="Informations personnelles"
			username={acc?.username}
		/>
		<div>
			<Button on:click={editAccount} outline={true}>Mettre à jour</Button>
		</div>
	{/if}
</div>
