<script lang="ts">
	import { GetLastVisitedOrUpdatedDocument } from '$lib/graphql/_gen/typed-document-nodes';
	import LoaderIndicator from '$lib/ui/utils/LoaderIndicator.svelte';
	import { operationStore, query } from '@urql/svelte';
	import { goto } from '$app/navigation';
	import { ProBeneficiaryCard, ProBeneficiarySearchBar } from '$lib/ui';
	import { account } from '$lib/stores';

	const result = operationStore(GetLastVisitedOrUpdatedDocument, { accountId: $account.accountId });

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
		<div class="fr-grid-row fr-grid-row--gutters">
			{#each $result.data.lastVisited as lastVisited, i (i)}
				<div class="fr-col-12 fr-col-sm-6 fr-col-md-4 fr-col-lg-3">
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
		<div class="fr-grid-row fr-grid-row--gutters">
			{#each $result.data.lastUpdated as lastUpdated, i (i)}
				<div class="fr-col-12 fr-col-sm-6 fr-col-md-4 fr-col-lg-3">
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
