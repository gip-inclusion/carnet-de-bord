<script context="module" lang="ts">
	import type { GetNotebooksAllAndRecentQuery } from '$lib/graphql/_gen/typed-document-nodes';
	import { GetNotebooksAllAndRecentDocument } from '$lib/graphql/_gen/typed-document-nodes';
	import type { Load } from '@sveltejs/kit';
	import type { OperationStore } from '@urql/svelte';
	import { operationStore, query } from '@urql/svelte';
	import LoaderIndicator from '$lib/ui/utils/LoaderIndicator.svelte';

	const today = new Date();
	const lastWeek = addWeeks(today, -1);
	const afterDate = { _gt: lastWeek };
	export const load: Load = async () => {
		const result = operationStore(GetNotebooksAllAndRecentDocument, { afterDate });

		return {
			props: {
				result,
			},
		};
	};
</script>

<script lang="ts">
	import addWeeks from 'date-fns/addWeeks';
	import { formatDate } from '$lib/utils/date';
	import { Text } from '$lib/ui/utils';

	export let result: OperationStore<GetNotebooksAllAndRecentQuery>;

	query(result);

	$: all = $result.data?.all?.aggregate?.count;
	$: open = $result.data?.open?.aggregate?.count;
	$: modified = $result.data?.modified?.aggregate?.count;
	$: shared =
		$result.data?.shared?.nodes?.filter(
			({ members_aggregate }) => 1 < (members_aggregate?.aggregate?.count || 0)
		).length || 0;
	$: recentlyCreated = $result.data?.recentlyCreated?.aggregate?.count;
	$: recentlyOpen = $result.data?.open?.aggregate?.count;
	$: recentlyModified = $result.data?.modified?.aggregate?.count;
	$: connections = $result.data?.structConnections
		?.map(({ id, name, city, professionals_aggregate }) => ({
			id,
			name,
			city,
			count: professionals_aggregate?.aggregate?.count,
		}))
		.sort((s1, s2) => s2.count - s1.count);
</script>

<LoaderIndicator {result}>
	<div>
		<div class="flex flex-col gap-4">
			<h2 class="fr-h4 pt-4">Statistiques d'utilisation</h2>
			<h3>Total</h3>
			<div class="flex flex-row gap-8 mt-8 pb-16">
				<div class="w-1/3">
					<h3 class="fr-h5 !mt-4 !mb-2 text-center">{all}</h3>
					<div class="text-center">
						carnet{all > 1 ? 's' : ''} créé{all > 1 ? 's' : ''} au total
					</div>
				</div>
				<div class="w-1/3">
					<h3 class="fr-h5 !mt-4 !mb-2 text-center">{shared}</h3>
					<div class="text-center">carnet{shared > 1 ? 's' : ''} avec 2 accompagnants ou plus</div>
				</div>
				<div class="w-1/3">
					<h3 class="fr-h5 !mt-4 !mb-2 text-center">{open}</h3>
					<div class="text-center">carnet{open > 1 ? 's' : ''} ouvert{open > 1 ? 's' : ''}</div>
				</div>
				<div class="w-1/3">
					<h3 class="fr-h5 !mt-4 !mb-2 text-center">{modified}</h3>
					<div class="text-center">
						carnet{modified > 1 ? 's' : ''} modifié{modified > 1 ? 's' : ''}
					</div>
				</div>
			</div>
			<h3>Depuis le {formatDate(lastWeek.toString())}</h3>
			<div class="flex flex-row gap-8 mt-8 pb-16">
				<div class="w-1/3">
					<h3 class="fr-h5 !mt-4 !mb-2 text-center">{recentlyCreated}</h3>
					<div class="text-center">
						carnet{recentlyCreated > 1 ? 's' : ''} créé{recentlyCreated > 1 ? 's' : ''}
					</div>
				</div>
				<div class="w-1/3">
					<h3 class="fr-h5 !mt-4 !mb-2 text-center">{recentlyOpen}</h3>
					<div class="text-center">
						carnet{recentlyOpen > 1 ? 's' : ''} ouvert{recentlyOpen > 1 ? 's' : ''}
					</div>
				</div>
				<div class="w-1/3">
					<h3 class="fr-h5 !mt-4 !mb-2 text-center">{recentlyModified}</h3>
					<div class="text-center">
						carnet{recentlyModified > 1 ? 's' : ''} modifié{recentlyModified > 1 ? 's' : ''}
					</div>
				</div>
			</div>
			<h2 class="fr-h4 pt-4">Activité par structure</h2>
			<table>
				<thead>
					<tr>
						<th>Nom</th>
						<th>Ville</th>
						<th>Comptes actifs depuis le<br />{formatDate(lastWeek.toString())}</th>
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
		</div>
	</div>
</LoaderIndicator>
