<script context="module" lang="ts">
	import { Select, Button } from '$lib/ui/base';
	import { ProBeneficiaryCreate, ProBeneficiaryCard } from '$lib/ui';
	import LoaderIndicator from '$lib/ui/utils/LoaderIndicator.svelte';
	import type {
		CreateBeneficiaryMutationStore,
		NotebookMember,
		SearchNotebookMemberQueryStore,
		SearchNotebookMemberQueryVariables,
	} from '$lib/graphql/_gen/typed-document-nodes';
	import {
		SearchNotebookMemberDocument,
		CreateBeneficiaryDocument,
	} from '$lib/graphql/_gen/typed-document-nodes';
	import type { Load } from '@sveltejs/kit';
	import { operationStore, query } from '@urql/svelte';
	import { addMonths } from 'date-fns';

	const dt = {
		none: 'none',
		'3months': '3months',
		'3-6months': '3-6months',
		'6-12months': '6-12months',
		'12months': '12months',
	};

	function buildQueryVariables({ professionalId, search, selected }) {
		const today = new Date();
		let visitDate = { _gt: undefined, _lt: undefined };

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

		const variables: SearchNotebookMemberQueryVariables = { professionalId, visitDate };
		if (search) {
			variables.filter = `%${search}%`;
		}

		return variables;
	}

	export const load: Load = async ({ page, session }) => {
		const search = page.query.get('search');

		let selected = dt.none;
		if (page.query.get('dt') && dt[page.query.get('dt')]) {
			selected = dt[page.query.get('dt')];
		}
		const { professionalId } = session.user;
		const queryVariables = buildQueryVariables({ professionalId, search, selected });
		const result = operationStore(SearchNotebookMemberDocument, queryVariables);
		const createBeneficiaryResult = operationStore(CreateBeneficiaryDocument);

		return {
			props: {
				result,
				search,
				createBeneficiaryResult,
				professionalId,
				selected,
			},
		};
	};
</script>

<script lang="ts">
	import { openComponent } from '$lib/stores';
	export let createBeneficiaryResult: CreateBeneficiaryMutationStore;
	export let result: SearchNotebookMemberQueryStore;
	export let search: string;
	export let professionalId: string;
	export let selected: string;
	let searching = false;

	query(result);

	function updateUrl(search, dt) {
		const url = new URL(window.location.toString());
		url.searchParams.set('search', search);
		url.searchParams.set('dt', dt);
		window.history.pushState({}, '', url);
	}

	function onSelect() {
		updateUrl(search, selected);
		$result.variables = buildQueryVariables({ professionalId, search, selected });
		$result.reexecute();
	}

	function carnetUrl({ id }: { id: string }) {
		return `/pro/carnet/${id}`;
	}

	function addBeneficiary() {
		openComponent.open({ component: ProBeneficiaryCreate, props: { createBeneficiaryResult } });
	}
	function handleSubmit() {
		updateUrl(search, selected);
		$result.variables = buildQueryVariables({ professionalId, search, selected });
		$result.reexecute();
	}

	/* TODO: find a way without cheating on that type */
	$: members = ($result.data ? $result.data.notebook_member : []) as NotebookMember[];
	$: notebooks = members ? members.map((m) => m.notebook) : [];
</script>

<svelte:head>
	<title>Annuaire - carnet de bord</title>
</svelte:head>

<h1 class="fr-h2 float-left">Annuaire de mes bénéficiaires</h1>

<form class="flex flex-row w-full space-x-16" on:submit|preventDefault={handleSubmit}>
	<Select
		on:select={onSelect}
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
			<label class="fr-label" for="search-beneficiary"> Rechercher un bénéficiaire </label>
			<input
				class="fr-input"
				placeholder="Nom, téléphone, n° CAF, n° Pôle emploi"
				type="search"
				id="search-beneficiary"
				name="search"
				bind:value={search}
				disabled={!handleSubmit}
			/>
			<button class="fr-btn" disabled={!handleSubmit || searching}> Rechercher </button>
		</div>
	</div>
</form>
<LoaderIndicator {result}>
	{#if notebooks.length === 0}
		<div class="flex flex-col space-y-4 items-center">
			<div class="text-france-blue font-bold">
				Désolé, aucun bénéficiaire ne correspond à votre recherche.
			</div>
			<div>Veuillez cliquer sur le bouton ci-dessous pour ajouter un bénéficiaire.</div>
			<div class="pt-4">
				<Button on:click={addBeneficiary} iconSide="right">Ajouter un bénéficiaire</Button>
			</div>
		</div>
	{:else}
		<div class="flex flex-row flex-wrap justify-between gap-1">
			{#each notebooks as notebook (notebook.id)}
				<div class="card-container">
					<ProBeneficiaryCard beneficiary={notebook.beneficiary} href={carnetUrl(notebook)} />
				</div>
			{/each}
		</div>
		<!-- {/if} -->
		<div>
			<Button outline={true} on:click={addBeneficiary}>Ajouter un nouveau bénéficiaire</Button>
		</div>
	{/if}
</LoaderIndicator>
