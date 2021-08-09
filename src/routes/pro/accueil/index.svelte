<script context="module" lang="ts">
	import { goto } from '$app/navigation';
	import { ProBeneficiaryCard, ProBeneficiarySearchBar } from '$lib/ui';
	import type { GetLastVisitedOrUpdatedQuery } from '$lib/_gen/typed-document-nodes';
	import { GetLastVisitedOrUpdatedDocument } from '$lib/_gen/typed-document-nodes';
	import type { Load } from '@sveltejs/kit';
	import type { OperationStore } from '@urql/svelte';
	import { operationStore, query } from '@urql/svelte';

	export const load: Load = async ({ session }) => {
		const { professionalId } = session.user;
		const result = operationStore(GetLastVisitedOrUpdatedDocument, { professionalId });

		return {
			props: {
				result
			}
		};
	};
</script>

<script lang="ts">
	import LoaderIndicator from '$lib/ui/utils/LoaderIndicator.svelte';

	export let result: OperationStore<GetLastVisitedOrUpdatedQuery>;

	query(result);

	function onSearch({ detail }) {
		const { search } = detail;
		goto(`/pro/annuaire?search=${search}`);
	}

	function beneficiaryUrl({ id }: { id: string }) {
		return `/pro/beneficiaire/${id}`;
	}
</script>

<div class="flex flex-col space-y-8 px-40">
	<h1 class="fr-h2">Rechercher un bénéficiaire</h1>

	<ProBeneficiarySearchBar on:search={(event) => onSearch(event)} />

	<LoaderIndicator {result}>
		<div>
			<h2 class="fr-h5 bf-500">Derniers profils consultés</h2>
			<div class="flex flex-row flex-wrap justify-between gap-1">
				{#each $result.data.lastVisited as lastVisited (lastVisited.notebook.beneficiary.id)}
					<div class="card-container">
						<ProBeneficiaryCard
							href={beneficiaryUrl(lastVisited.notebook.beneficiary)}
							beneficiary={lastVisited.notebook.beneficiary}
						/>
					</div>
				{/each}
			</div>
		</div>
		<div>
			<h2 class="fr-h5 bf-500">Derniers profils modifiés</h2>
			<div class="flex flex-row flex-wrap justify-between gap-1">
				{#each $result.data.lastUpdated as lastUpdated}
					<div class="card-container">
						<ProBeneficiaryCard
							href={beneficiaryUrl(lastUpdated.notebook.beneficiary)}
							beneficiary={lastUpdated.notebook.beneficiary}
						/>
					</div>
				{/each}
			</div>
		</div>
	</LoaderIndicator>
</div>

<style lang="postcss">
	.bf-500 {
		color: var(--bf500);
	}

	.card-container {
		width: 49%;
		@apply py-2;
	}
</style>
