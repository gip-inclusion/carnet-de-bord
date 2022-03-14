<script lang="ts" context="module">
	import type { Load } from '@sveltejs/kit';

	export type AllFilter = 'all';
	export type Nomember = 'nomember';
	export type Withmember = 'withmember';

	export type MemberFilter = AllFilter | Nomember | Withmember;

	function getFilter(filter: string): MemberFilter {
		if (filter === 'nomember') return 'nomember';
		if (filter === 'withmember') return 'withmember';
		return 'all';
	}

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

	import GroupCheckbox from '$lib/ui/base/GroupCheckbox.svelte';
	import { operationStore, query } from '@urql/svelte';
	import LoaderIndicator from '$lib/ui/utils/LoaderIndicator.svelte';
	import Pagination from '$lib/ui/Pagination.svelte';
	import { displayFullName } from '$lib/ui/format';
	import { formatDateISO } from '$lib/utils/date';
	import { page } from '$app/stores';
	import { onDestroy } from 'svelte';
	import { goto } from '$app/navigation';
	import Select from '$lib/ui/base/Select.svelte';
	import { homeForRole } from '$lib/routes';
	import Breadcrumbs from '$lib/ui/base/Breadcrumbs.svelte';

	const pageSize = 10;

	export let currentPage: number;
	export let filter: MemberFilter;
	export let search: string;

	function getWithMemberFilter(filter: MemberFilter): BeneficiaryBoolExp {
		if (filter === 'nomember') {
			return { _not: { notebook: { members: {} } } };
		}
		if (filter === 'withmember') {
			return { notebook: { members: {} } };
		}
		return {};
	}

	let filterOptions: { label: string; name: MemberFilter }[] = [
		{ label: 'Tous', name: 'all' },
		{ label: 'Suivi', name: 'withmember' },
		{ label: 'Non suivi', name: 'nomember' },
	];

	const result = operationStore(
		GetBeneficiariesDocument,
		{ offset: currentPage * pageSize, limit: pageSize, withMembers: getWithMemberFilter(filter) },
		{ additionalTypenames: ['beneficiary'], requestPolicy: 'cache-and-network' }
	);

	query(result);

	const unsub = page.subscribe(() => {
		$result.variables = {
			offset: currentPage * pageSize,
			limit: pageSize,
			withMembers: getWithMemberFilter(filter),
		};
		$result.reexecute();
	});
	onDestroy(unsub);

	function updateFilters(event: CustomEvent<{ selected: MemberFilter }>) {
		// We should not mutate the $page.url.searchParams AND use goto
		// since it make unreliable behaviour
		// so we create a new URL object to process our new params and then
		// use it for goto.
		const urlParams = new URLSearchParams([...$page.url.searchParams.entries()]);
		urlParams.set('filter', event.detail.selected);
		urlParams.set('page', '1');
		goto(`?${urlParams.toString()}`, { replaceState: true, keepfocus: true });
	}

	let selectedBeneficiaries = [];
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
<LoaderIndicator {result}>
	<div class="flex flex-col gap-8">
		<form>
			<div class="flex items-end justify-between">
				<Select
					selected={filter}
					on:select={updateFilters}
					options={filterOptions}
					selectLabel="Rattachement"
					classNames="!mb-0"
				/>
				<div class="fr-search-bar  " role="search">
					<label class="fr-label sr-only" for="search-beneficiary-input">
						rechercher des beneficiaire
					</label>
					<input
						disabled
						class="fr-input"
						placeholder="Nom de famille"
						type="search"
						id="search-beneficiary-input"
						name="search"
						value={search}
					/>
					<button disabled class="fr-btn"> Rechercher </button>
				</div>
			</div>
		</form>
		<table class="w-full fr-table fr-table--layout-fixed">
			<caption class="sr-only">Liste des bénéficiaires</caption>
			<thead>
				<tr>
					<th>Tout</th>
					<th class="text-left">Nom</th>
					<th class="text-left">Prénom</th>
					<th class="text-left">Structure</th>
					<th class="text-left">Suivi par</th>
					<th class="text-left">Depuis le</th>
					<th class="text-center">Voir le carnet</th>
				</tr>
			</thead>
			<tbody>
				{#each $result.data.beneficiaries as beneficiary}
					<tr>
						<td>
							<GroupCheckbox
								selectedOptions={selectedBeneficiaries}
								classNames="bottom-3 left-3"
								groupId={'suivi'}
								option={{ name: beneficiary.id, label: '' }}
								title={`${
									selectedBeneficiaries.includes(beneficiary.id) ? 'Désélectionner' : 'Sélectionner'
								} le suivi`}
							/>
						</td>
						<td>{beneficiary.lastname}</td>
						<td>{beneficiary.firstname}</td>
						<td>
							{#if beneficiary.structures.length > 0}
								{beneficiary.structures[0].structure.name}
							{:else}
								-
							{/if}
						</td>
						<td>
							{#if beneficiary.notebook.members.length > 0}
								{displayFullName(beneficiary.notebook.members[0].professional)}
							{:else}
								non suivi
							{/if}
						</td>
						<td>
							{#if beneficiary.notebook.members.length > 0}
								{formatDateISO(new Date(beneficiary.notebook?.members[0].createdAt))}
							{:else}
								-
							{/if}
						</td>
						<td />
					</tr>
				{/each}
				{#if $result.data.beneficiaries.length === 0}
					<tr><td colspan="10">Aucun bénéficiaire.</td></tr>
				{/if}
			</tbody>
		</table>
		<div class="flex justify-center">
			<Pagination
				{currentPage}
				{pageSize}
				count={$result.data.beneficiary_aggregate.aggregate.count}
			/>
		</div>
	</div>
</LoaderIndicator>
