<script lang="ts" context="module">
	import type { Load } from '@sveltejs/kit';

	export const load: Load = async ({ url }) => {
		const params = url.searchParams;
		return {
			props: {
				currentPage: parseInt(params.get('page') ?? '1', 10),
				filter: getFilter(params.get('filter')),
				search: params.get('search') ?? '',
			},
		};
	};
</script>

<script lang="ts">
	import {
		BeneficiaryBoolExp,
		GetBeneficiariesDocument,
	} from '$lib/graphql/_gen/typed-document-nodes';

	import { operationStore, query } from '@urql/svelte';
	import LoaderIndicator from '$lib/ui/utils/LoaderIndicator.svelte';
	import Pagination from '$lib/ui/Pagination.svelte';
	import { page } from '$app/stores';
	import { onDestroy } from 'svelte';
	import { homeForRole } from '$lib/routes';
	import Breadcrumbs from '$lib/ui/base/Breadcrumbs.svelte';
	import BeneficiaryFilterView, {
		getFilter,
		MemberFilter,
	} from '$lib/ui/BeneficiaryList/Filters.svelte';
	import BeneficiaryList from '$lib/ui/BeneficiaryList/List.svelte';
	import { goto } from '$app/navigation';

	const pageSize = 10;

	export let currentPage: number;
	export let filter: MemberFilter;
	export let search: string;

	function getWithMemberFilter(filter: MemberFilter): BeneficiaryBoolExp {
		if (filter === 'nomember') {
			return { notebook: { _not: { members: {} } } };
		}
		if (filter === 'withmember') {
			return { notebook: { members: {} } };
		}
		return {};
	}

	const result = operationStore(
		GetBeneficiariesDocument,
		{
			search: search,
			offset: (currentPage - 1) * pageSize,
			limit: pageSize,
			withMembers: getWithMemberFilter(filter),
		},
		{ additionalTypenames: ['beneficiary'], requestPolicy: 'cache-and-network' }
	);

	query(result);

	const unsub = page.subscribe(() => {
		$result.variables = {
			search,
			offset: (currentPage - 1) * pageSize,
			limit: pageSize,
			withMembers: getWithMemberFilter(filter),
		};
		$result.reexecute();
	});

	onDestroy(unsub);

	function updateFilters(event: CustomEvent<{ filter: MemberFilter; search: string }>) {
		// We should not mutate the $page.url.searchParams AND use goto
		// since it make unreliable behaviour
		// so we create a new URL object to process our new params and then
		// use it for goto.
		const urlParams = new URLSearchParams([...$page.url.searchParams.entries()]);
		urlParams.set('filter', event.detail.filter);
		urlParams.set('search', event.detail.search);
		urlParams.set('page', '1');
		goto(`?${urlParams.toString()}`);
	}

	// let selectedBeneficiaries = [];
	let breadcrumbs = [
		{
			name: 'accueil',
			path: homeForRole('manager'),
			label: 'Accueil',
		},
		{
			name: 'structure',
			path: '',
			label: `bénéficiaires`,
		},
	];
</script>

<svelte:head>
	<title>Liste des bénéficiaires - Carnet de bord</title>
</svelte:head>
<Breadcrumbs segments={breadcrumbs} />
<h1>Bénéficiaires</h1>

<div class="flex flex-col gap-8">
	<BeneficiaryFilterView {filter} {search} on:filter-update={updateFilters} />
	<LoaderIndicator {result}>
		<BeneficiaryList beneficiaries={$result.data.beneficiaries} />
		<div class="flex justify-center">
			<Pagination
				{currentPage}
				{pageSize}
				count={$result.data.search_beneficiaries_aggregate.aggregate.count}
			/>
		</div>
	</LoaderIndicator>
</div>
