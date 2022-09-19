<script lang="ts">
	import type { BeneficiaryCountFilter } from './Filters.svelte';
	import type { GetProfessionalsForStructureQuery } from '$lib/graphql/_gen/typed-document-nodes';
	type Professional = GetProfessionalsForStructureQuery['professional'][0];

	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	import { GetProfessionalsForStructureDocument } from '$lib/graphql/_gen/typed-document-nodes';

	import { operationStore, query } from '@urql/svelte';
	import { LoaderIndicator } from '../utils';
	import List from './List.svelte';
	import BeneficiaryCountFilterView from './Filters.svelte';

	export let filter: BeneficiaryCountFilter;
	export let structureId: string = null;

	function updateFilters(event: CustomEvent<{ filter: BeneficiaryCountFilter }>) {
		const urlParams = new URLSearchParams([...$page.url.searchParams.entries()]);
		urlParams.set('filter', event.detail.filter);
		goto(`?${urlParams.toString()}`);
	}

	function applyFilter(professionals: Professional[], filter: BeneficiaryCountFilter) {
		if (filter === 'all') return professionals;
		const predicate =
			filter === 'noBeneficiaries'
				? (professional: Professional) =>
						professional.account.notebooksWhereMember_aggregate.aggregate.count === 0
				: (professional: Professional) =>
						professional.account.notebooksWhereMember_aggregate.aggregate.count > 0;
		return professionals.filter(predicate);
	}

	const getProfessionals = operationStore(
		GetProfessionalsForStructureDocument,
		{ structureId },
		{ requestPolicy: 'cache-and-network' }
	);

	query(getProfessionals);

	$: professionals = applyFilter($getProfessionals.data?.professional ?? [], filter);
</script>

<div class="flex flex-col gap-8">
	<BeneficiaryCountFilterView {filter} on:filter-update={updateFilters} />
	<LoaderIndicator result={getProfessionals}>
		<List {professionals} />
	</LoaderIndicator>
</div>
