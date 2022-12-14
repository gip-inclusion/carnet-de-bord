<script lang="ts">
	import { Select } from '$lib/ui/base';
	import { ProBeneficiaryCard } from '$lib/ui';
	import LoaderIndicator from '$lib/ui/utils/LoaderIndicator.svelte';
	import type {
		NotebookPublicView,
		SearchPublicNotebooksQueryVariables,
	} from '$lib/graphql/_gen/typed-document-nodes';
	import { SearchPublicNotebooksDocument } from '$lib/graphql/_gen/typed-document-nodes';
	import { operationStore, query } from '@urql/svelte';
	import { browser } from '$app/environment';
	import { addMonths } from 'date-fns';

	import type { PageData } from './$types';
	import { dt } from './+page';

	export let data: PageData;

	let searching = false;
	let { search, selected } = data;

	const queryVariables = buildQueryVariables({
		search,
		selected,
	});
	const result = operationStore(SearchPublicNotebooksDocument, queryVariables);
	query(result);

	function buildQueryVariables({ search, selected }) {
		const today = new Date();
		const visitDate = { _gt: undefined, _lt: undefined };

		if (selected === dt['3months']) {
			visitDate._gt = addMonths(today, -3);
		} else if (selected === dt['3-6months']) {
			visitDate._gt = addMonths(today, -6);
			visitDate._lt = addMonths(today, -3);
		} else if (selected === dt['6-12months']) {
			visitDate._gt = addMonths(today, -12);
			visitDate._lt = addMonths(today, -6);
		} else if (selected === dt['12months']) {
			visitDate._lt = addMonths(today, -12);
		}

		const variables: SearchPublicNotebooksQueryVariables = {};
		variables.filter = `${search ?? ''}`;
		return variables;
	}

	function updateUrl(search?: string | null, dt?: string | null) {
		const url = new URL(window.location.toString());
		url.searchParams.set('search', search);
		url.searchParams.set('dt', dt);
		window.history.pushState({}, '', url);
	}

	function updateResult() {
		updateUrl(search, selected);
		$result.variables = buildQueryVariables({
			search,
			selected,
		});
		$result.reexecute();
	}

	function carnetUrl(id: string | undefined) {
		// NotebookPublicView has the id type optional as it's coming from a Postgres view
		return id ? `/pro/carnet/${id}` : '#';
	}

	function handleSubmit() {
		updateResult();
	}

	/* TODO: find a way without cheating on that type */
	$: notebooks = ($result.data ? $result.data.search_public_notebooks : []) as NotebookPublicView[];

	function openCrisp() {
		if (browser && window.$crisp) {
			window.$crisp.push(['do', 'chat:open']);
		}
	}
</script>

<svelte:head>
	<title>Annuaire - Carnet de bord</title>
</svelte:head>

<h1 class="fr-h2 float-left">Annuaire de mes bénéficiaires</h1>

<form class="flex flex-row w-full space-x-16" on:submit|preventDefault={handleSubmit}>
	<Select
		on:select={() => updateResult()}
		options={[
			{ name: dt.none, label: 'tous' },
			{ name: dt['3months'], label: 'dans les 3 derniers mois' },
			{ name: dt['3-6months'], label: 'entre les 3 et 6 derniers mois' },

			{ name: dt['6-12months'], label: 'entre les 6 et 12 derniers mois' },
			{ name: dt['12months'], label: 'il y a plus de 12 mois' },
		]}
		bind:selected
		selectHint="Sélectionner un filtre"
		selectLabel="Profils consultés..."
	/>
	<div class="mb-6 self-end">
		<div class="fr-search-bar" role="search">
			<label class="fr-label" for="search-beneficiary">Rechercher un bénéficiaire</label>
			<input
				class="fr-input"
				placeholder="Nom, téléphone, n° CAF, n° Pôle emploi"
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
	{#if notebooks.length === 0}
		<div class="flex flex-col space-y-4 items-center">
			<div class="text-france-blue font-bold">
				Désolé, aucun bénéficiaire ne correspond à votre recherche.
			</div>
			<p>
				Si un bénéficiaire est manquant, <button class="underline" on:click={openCrisp}
					>contactez-nous par tchat</button
				>.
			</p>
		</div>
	{:else}
		<div class="fr-grid-row fr-grid-row--gutters">
			{#each notebooks as notebook (notebook.id)}
				<div class="fr-col-12 fr-col-sm-6 fr-col-md-4 fr-col-lg-3">
					<ProBeneficiaryCard beneficiary={notebook.beneficiary} href={carnetUrl(notebook.id)} />
				</div>
			{/each}
		</div>
		<p>
			Si un bénéficiaire est manquant, <button class="underline" on:click={openCrisp}
				>contactez-nous par tchat</button
			>.
		</p>
	{/if}
</LoaderIndicator>
