<script context="module" lang="ts">
	import type { GetNotebooksAllAndRecentQuery } from '$lib/graphql/_gen/typed-document-nodes';
	import { GetNotebooksAllAndRecentDocument } from '$lib/graphql/_gen/typed-document-nodes';
	import type { Load } from '@sveltejs/kit';
	import type { OperationStore } from '@urql/svelte';
	import { operationStore, query } from '@urql/svelte';
	import LoaderIndicator from '$lib/ui/utils/LoaderIndicator.svelte';

	const today = new Date();
	const lastWeek = addWeeks(today, -1);
	const creationDate = { _gt: lastWeek };
	export const load: Load = async () => {
		const result = operationStore(GetNotebooksAllAndRecentDocument, { creationDate });

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

	export let result: OperationStore<GetNotebooksAllAndRecentQuery>;

	query(result);

	$: all = $result.data?.all?.aggregate?.count;
	$: recent = $result.data?.recent?.aggregate?.count;
	$: shared =
		$result.data?.shared?.nodes?.filter(
			({ members_aggregate }) => 1 < (members_aggregate?.aggregate?.count || 0)
		).length || 0;
</script>

<LoaderIndicator {result}>
	<div>
		<div class="flex flex-col gap-4">
			<h2 class="fr-h4 pt-4">Statistiques d'utilisation</h2>
			<p>{all} carnets au total</p>
			<p>{recent} carnets créés depuis le {formatDate(lastWeek.toString())}</p>
			<p>{shared} carnets avec 2 accompagnants ou plus</p>
		</div>
	</div>
</LoaderIndicator>
