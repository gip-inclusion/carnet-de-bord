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
	$: recent = $result.data?.recent?.aggregate?.count;
	$: shared =
		$result.data?.shared?.nodes?.filter(
			({ members_aggregate }) => 1 < (members_aggregate?.aggregate?.count || 0)
		).length || 0;
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
			<div class="flex flex-row gap-8 mt-8 pb-16">
				<div class="w-1/3">
					<h3 class="fr-h5 !mt-4 !mb-2 text-center">{all}</h3>
					<div class="text-center">carnets au total</div>
				</div>
				<div class="w-1/3">
					<h3 class="fr-h5 !mt-4 !mb-2 text-center">{recent}</h3>
					<div class="text-center">carnets créés depuis le {formatDate(lastWeek.toString())}</div>
				</div>
				<div class="w-1/3">
					<h3 class="fr-h5 !mt-4 !mb-2 text-center">{shared}</h3>
					<div class="text-center">carnets avec 2 accompagnants ou plus</div>
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
