<script context="module" lang="ts">
	import { goto } from '$app/navigation';
	import { ProBeneficiaryCard, ProBeneficiarySearchBar } from '$lib/ui';
	import {
		AddRomesDocument,
		GetLastVisitedOrUpdatedDocument,
	} from '$lib/graphql/_gen/typed-document-nodes';
	import type {
		AddRomesMutationStore,
		GetLastVisitedOrUpdatedQueryStore,
	} from '$lib/graphql/_gen/typed-document-nodes';
	import type { Load } from '@sveltejs/kit';
	import { mutation, operationStore, query } from '@urql/svelte';

	export const load: Load = async ({ session }) => {
		const { professionalId } = session.user;
		/* @TODO this request does not error in Hasura when called with a professional that's null; instead it matches on all, which is obviously not what we want */
		const result = operationStore(GetLastVisitedOrUpdatedDocument, { professionalId });
		const addRomesStore = operationStore(AddRomesDocument);

		return {
			props: {
				result,
				addRomesStore,
			},
		};
	};
</script>

<script lang="ts">
	import LoaderIndicator from '$lib/ui/utils/LoaderIndicator.svelte';

	export let result: GetLastVisitedOrUpdatedQueryStore;
	export let addRomesStore: AddRomesMutationStore;
	const exporter = mutation(addRomesStore);

	const romeToDbRome = ({ rome, text }) => {
		return {
			code: rome,
			description: text.split('(')[0].trim(),
			label: text,
		};
	};

	fetch('/pro/carnet/rome')
		.then((response) => response.json())
		.then(({ data }) => data.map(romeToDbRome))
		.then((codes) => exporter({ codes }));

	query(result);

	function onSearch({ detail }) {
		const { search } = detail;
		goto(`/pro/annuaire?search=${search}`);
	}

	function carnetUrl({ id }: { id: string }) {
		return `/pro/carnet/${id}`;
	}
</script>

<svelte:head>
	<title>Accueil Professionnel - Carnet de bord</title>
</svelte:head>

<h1 class="fr-h2">Rechercher un bénéficiaire</h1>

<ProBeneficiarySearchBar on:search={(event) => onSearch(event)} />

<LoaderIndicator {result}>
	<div>
		<h2 class="fr-h5 text-france-blue">Derniers profils consultés</h2>
		<div class="flex flex-row flex-wrap justify-between gap-1">
			{#each $result.data.lastVisited as lastVisited, i (i)}
				<div class="card-container">
					<ProBeneficiaryCard
						href={carnetUrl(lastVisited.notebook)}
						beneficiary={lastVisited.notebook.beneficiary}
					/>
				</div>
			{:else}
				<p>Aucun(e) de vos bénéficiaires n'a été consulté(e) récemment.</p>
			{/each}
		</div>
	</div>
	<div>
		<h2 class="fr-h5 text-france-blue">Derniers profils modifiés</h2>
		<div class="flex flex-row flex-wrap justify-between gap-1">
			{#each $result.data.lastUpdated as lastUpdated, i (i)}
				<div class="card-container">
					<ProBeneficiaryCard
						href={carnetUrl(lastUpdated.notebook)}
						beneficiary={lastUpdated.notebook.beneficiary}
					/>
				</div>
			{:else}
				<p>Aucun(e) de vos bénéficiaires n'a été mis(e) à jour récemment.</p>
			{/each}
		</div>
	</div>
</LoaderIndicator>
