<script context="module" lang="ts">
	import { by, pluralize } from '$lib/helpers';
	import type { GetNotebooksStatsQuery } from '$lib/graphql/_gen/typed-document-nodes';
	import { GetNotebooksStatsDocument } from '$lib/graphql/_gen/typed-document-nodes';
	import type { Load } from '@sveltejs/kit';
	import type { OperationStore } from '@urql/svelte';
	import { operationStore, query } from '@urql/svelte';
	import LoaderIndicator from '$lib/ui/utils/LoaderIndicator.svelte';
	import { startOfMonth } from 'date-fns';

	const today = new Date();
	const startOfTime = new Date(0);
	const startOfThisMonth = startOfMonth(today);

	export const load: Load = async () => {
		const thisMonth = operationStore(GetNotebooksStatsDocument, {
			afterDate: { _gt: startOfThisMonth.toISOString() },
		});
		const beginning = operationStore(GetNotebooksStatsDocument, {
			afterDate: { _gt: startOfTime.toISOString() },
		});

		return {
			props: {
				thisMonth,
				beginning,
			},
		};
	};
</script>

<script lang="ts">
	import { formatDate } from '$lib/utils/date';
	import { Text } from '$lib/ui/utils';

	export let beginning: OperationStore<GetNotebooksStatsQuery>;
	export let thisMonth: OperationStore<GetNotebooksStatsQuery>;

	query(beginning);
	query(thisMonth);

	$: created = $beginning.data?.created?.aggregate?.count;
	$: open = $beginning.data?.open?.aggregate?.count;
	$: modified = $beginning.data?.modified?.aggregate?.count;
	$: infoAdded = $beginning.data?.infoAdded?.aggregate?.count;
	$: shared =
		$beginning.data?.shared?.nodes?.filter(
			({ members_aggregate }) => 1 < (members_aggregate?.aggregate?.count || 0)
		).length || 0;
	$: connections = $beginning.data?.structConnections
		?.map(({ id, name, city, professionals_aggregate }) => ({
			id,
			name,
			city,
			count: professionals_aggregate?.aggregate?.count,
		}))
		.sort(by(({ count }) => count, 'DESC'));
	$: recentlyCreated = $thisMonth.data?.created?.aggregate?.count;
	$: recentlyOpen = $thisMonth.data?.open?.aggregate?.count;
	$: recentlyModified = $thisMonth.data?.modified?.aggregate?.count;
	$: recentlyInfoAdded = $thisMonth.data?.infoAdded?.aggregate?.count;
	$: recentlyShared =
		$thisMonth.data?.shared?.nodes?.filter(
			({ members_aggregate }) => 1 < (members_aggregate?.aggregate?.count || 0)
		).length || 0;
	$: recentConnections = $thisMonth.data?.structConnections
		?.map(({ id, name, city, professionals_aggregate }) => ({
			id,
			name,
			city,
			count: professionals_aggregate?.aggregate?.count,
		}))
		.sort(by(({ count }) => count, 'DESC'));
</script>

<svelte:head>
	<title>Statistiques - Carnet de bord</title>
</svelte:head>

<div>
	<div class="flex flex-col gap-4">
		<h2 class="pt-4">Statistiques d'utilisation</h2>
		<h3>Depuis le {formatDate(startOfThisMonth.toString())}</h3>
		<LoaderIndicator result={thisMonth}>
			<div class="flex flex-row gap-8 mt-8 pb-16">
				<div class="w-1/4">
					<h3 class="fr-h5 !mt-4 !mb-2 text-center">{recentlyCreated}</h3>
					<div class="text-center">
						{pluralize('carnet', recentlyCreated)}
						{pluralize('créé', recentlyCreated)}
					</div>
				</div>
				<div class="w-1/4">
					<h3 class="fr-h5 !mt-4 !mb-2 text-center">{recentlyShared}</h3>
					<div class="text-center">
						{pluralize('carnet', recentlyShared)}
					</div>
				</div>
				<div class="w-1/4">
					<h3 class="fr-h5 !mt-4 !mb-2 text-center">{recentlyOpen}</h3>
					<div class="text-center">
						{pluralize('carnet', recentlyOpen)}
						{pluralize('ouvert', recentlyOpen)}
					</div>
				</div>
				<div class="w-1/4">
					<h3 class="fr-h5 !mt-4 !mb-2 text-center">{recentlyModified}</h3>
					<div class="text-center">
						{pluralize('carnet', recentlyModified)}
						{pluralize('modifié', recentlyModified)}
					</div>
				</div>
				<div class="w-1/4">
					<h3 class="fr-h5 !mt-4 !mb-2 text-center">{recentlyInfoAdded}</h3>
					<div class="text-center">
						{pluralize('carnet', recentlyInfoAdded)} avec ajout d'axe/objectif/action
					</div>
				</div>
			</div>
			<h2 class="fr-h4 pt-4">Activité par structure</h2>
			<table>
				<thead>
					<tr>
						<th>Nom</th>
						<th>Ville</th>
						<th>
							{pluralize('Compte', recentConnections.length)}
							{pluralize('actif', recentConnections.length)} depuis le<br />{formatDate(
								startOfThisMonth.toString()
							)}
						</th>
					</tr>
				</thead>
				<tbody>
					{#each recentConnections as connection (connection.id)}
						<tr>
							<td><Text value={connection.name} /></td>
							<td><Text value={connection.city} /></td>
							<td class="text-right">{connection.count}</td><td />
						</tr>
					{/each}
				</tbody>
			</table>
		</LoaderIndicator>
		<hr />
		<h3>Total</h3>
		<LoaderIndicator result={beginning}>
			<div class="flex flex-row gap-8 mt-8 pb-16">
				<div class="w-1/4">
					<h3 class="fr-h5 !mt-4 !mb-2 text-center">{created}</h3>
					<div class="text-center">
						{pluralize('carnet', created)}
						{pluralize('créé', created)} au total
					</div>
				</div>
				<div class="w-1/4">
					<h3 class="fr-h5 !mt-4 !mb-2 text-center">{shared}</h3>
					<div class="text-center">
						{pluralize('carnet', shared)} avec 2 accompagnants ou plus
					</div>
				</div>
				<div class="w-1/4">
					<h3 class="fr-h5 !mt-4 !mb-2 text-center">{open}</h3>
					<div class="text-center">
						{pluralize('carnet', open)}
						{pluralize('ouvert', open)}
					</div>
				</div>
				<div class="w-1/4">
					<h3 class="fr-h5 !mt-4 !mb-2 text-center">{modified}</h3>
					<div class="text-center">
						{pluralize('carnet', modified)}
						{pluralize('modifié', modified)}
					</div>
				</div>
				<div class="w-1/4">
					<h3 class="fr-h5 !mt-4 !mb-2 text-center">{infoAdded}</h3>
					<div class="text-center">
						{pluralize('carnet', infoAdded)} avec ajout d'axe/objectif/action
					</div>
				</div>
			</div>
			<h2 class="fr-h4 pt-4">Activité par structure</h2>
			<table>
				<thead>
					<tr>
						<th>Nom</th>
						<th>Ville</th>
						<th>
							{pluralize('Compte', connections.length)}
							{pluralize('actif', connections.length)} depuis le<br />début
						</th>
					</tr>
				</thead>
				<tbody>
					{#each connections as connection (connection.id)}
						<tr>
							<td><Text value={connection.name} /></td>
							<td><Text value={connection.city} /></td>
							<td class="text-right">{connection.count}</td><td />
						</tr>
					{/each}
				</tbody>
			</table>
		</LoaderIndicator>
	</div>
</div>
