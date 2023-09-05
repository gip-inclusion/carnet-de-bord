<script lang="ts">
	import {
		GetLastVisitedOrUpdatedDocument,
		type GetLastVisitedOrUpdatedQuery,
	} from '$lib/graphql/_gen/typed-document-nodes';
	import LoaderIndicator from '$lib/ui/utils/LoaderIndicator.svelte';
	import { operationStore, query } from '@urql/svelte';
	import { goto } from '$app/navigation';
	import { ProBeneficiaryCard, ProBeneficiarySearchBar } from '$lib/ui';
	import { accountData } from '$lib/stores';
	import ProSearchResults from '$lib/ui/BeneficiaryList/ProSearchResults.svelte';

	const result = operationStore(GetLastVisitedOrUpdatedDocument, { accountId: $accountData.id });

	query(result);

	type Notebook = GetLastVisitedOrUpdatedQuery['notebook'][0];

	$: notebooks = $result.data ? $result.data.notebook : [];
	$: lastVisitedNotebooks = [...notebooks].sort(sortByLastVisited).slice(0, 3);
	$: lastModifiedNotebooks = [...notebooks].sort(sortByLastModified).slice(0, 3);

	function sortByLastVisited(n1: Notebook, n2: Notebook): number {
		return (
			new Date(n2.members[0].lastVisitedAt).getTime() -
			new Date(n1.members[0].lastVisitedAt).getTime()
		);
	}

	function sortByLastModified(n1: Notebook, n2: Notebook): number {
		return (
			new Date(n2.members[0].lastModifiedAt).getTime() -
			new Date(n1.members[0].lastModifiedAt).getTime()
		);
	}

	function onSearch({ detail }) {
		const { search } = detail;
		goto(`/pro/annuaire?search=${search}`);
	}

	function carnetUrl({ id }: Notebook) {
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
		<h2 class="fr-h5 text-vert-cdb">Derniers profils consultés</h2>
		<div class="fr-grid-row fr-grid-row--gutters">
			{#each lastVisitedNotebooks as lastVisitedNotebook, i (i)}
				<div class="fr-col-12 fr-col-sm-6 fr-col-md-4 fr-col-lg-3">
					<ProBeneficiaryCard
						href={carnetUrl(lastVisitedNotebook)}
						beneficiary={lastVisitedNotebook.beneficiary}
					/>
				</div>
			{:else}
				<p>Aucun(e) de vos bénéficiaires n'a été consulté(e) récemment.</p>
			{/each}
		</div>
	</div>
	<div>
		<h2 class="fr-h5 text-vert-cdb">Derniers profils modifiés</h2>
		<div class="fr-grid-row fr-grid-row--gutters">
			{#each lastModifiedNotebooks as lastModifiedNotebook, i (i)}
				<div class="fr-col-12 fr-col-sm-6 fr-col-md-4 fr-col-lg-3">
					<ProBeneficiaryCard
						href={carnetUrl(lastModifiedNotebook)}
						beneficiary={lastModifiedNotebook.beneficiary}
					/>
				</div>
			{:else}
				<p>Aucun(e) de vos bénéficiaires n'a été mis(e) à jour récemment.</p>
			{/each}
		</div>
	</div>

	<div>
		<h2 class="fr-h5 text-vert-cdb">Mes bénéficiaires</h2>
		<ProSearchResults {notebooks} accountId={$accountData.id} />
	</div>
</LoaderIndicator>
