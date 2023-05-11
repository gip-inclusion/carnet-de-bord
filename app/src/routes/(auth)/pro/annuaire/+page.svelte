<script lang="ts">
	import LoaderIndicator from '$lib/ui/utils/LoaderIndicator.svelte';
	import type { SearchPublicNotebooksQueryVariables } from '$lib/graphql/_gen/typed-document-nodes';
	import { SearchPublicNotebooksDocument } from '$lib/graphql/_gen/typed-document-nodes';
	import { operationStore, query } from '@urql/svelte';
	import { browser } from '$app/environment';

	import type { PageData } from './$types';
	import { accountData } from '$lib/stores';
	import ProSearchResults from '$lib/ui/BeneficiaryList/ProSearchResults.svelte';

	export let data: PageData;

	const searching = false;
	let { search } = data;

	const queryVariables = buildQueryVariables({
		search,
	});
	const result = operationStore(SearchPublicNotebooksDocument, queryVariables, {
		pause: data.search ? false : true,
	});
	query(result);

	function buildQueryVariables({ search }) {
		const variables: SearchPublicNotebooksQueryVariables = {};
		variables.filter = `${search ?? ''}`;
		return variables;
	}

	function updateUrl(search?: string | null) {
		const url = new URL(window.location.toString());
		url.searchParams.set('search', search);
		window.history.pushState({}, '', url);
	}

	function updateResult() {
		updateUrl(search);
		$result.variables = buildQueryVariables({
			search,
		});
		$result.context.pause = false;
		$result.reexecute();
	}

	function handleSubmit() {
		updateResult();
	}

	$: notebooks = $result.data ? $result.data.notebooks : [];

	function openCrisp() {
		if (browser && window.$crisp) {
			window.$crisp.push(['do', 'chat:open']);
		}
	}
</script>

<svelte:head>
	<title>Annuaire - Carnet de bord</title>
</svelte:head>

<h1 class="fr-h2 float-left">Annuaire des bénéficiaires</h1>

<form class="w-full" on:submit|preventDefault={handleSubmit}>
	<div class="mb-6">
		<div class="fr-search-bar fr-search-bar--lg" role="search">
			<label class="fr-label" for="search-beneficiary">Rechercher un bénéficiaire</label>
			<input
				class="fr-input"
				placeholder="Prénom, Nom, téléphone, n° CAF/MSA, n° Pôle emploi"
				type="search"
				id="search-beneficiary"
				name="search"
				bind:value={search}
				disabled={!handleSubmit}
			/>
			<button class="fr-btn" disabled={!handleSubmit || searching}>Rechercher</button>
		</div>
	</div>
</form>
<LoaderIndicator {result}>
	{#if search}
		{#if notebooks.length === 0}
			<div class="flex flex-col space-y-4 items-center">
				<p class="text-vert-cdb font-bold">
					Désolé, aucun bénéficiaire ne correspond à votre recherche.
				</p>
				<p>
					Si un bénéficiaire est manquant, <button class="underline" on:click={openCrisp}
						>contactez-nous par tchat</button
					>.
				</p>
			</div>
		{:else}
			<ProSearchResults {notebooks} accountId={$accountData.id} />
			<p>
				Si un bénéficiaire est manquant, <button class="underline" on:click={openCrisp}
					>contactez-nous par tchat</button
				>.
			</p>
		{/if}
	{:else}
		<p>
			Vous pouvez rechercher un bénéficiaire à partir de son prénom, nom, numéro CAF, numéro Pôle
			Emploi ou numéro de téléphone.
		</p>
	{/if}
</LoaderIndicator>
