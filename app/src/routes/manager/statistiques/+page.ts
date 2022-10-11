import { by, pluralize } from '$lib/helpers';
import type { GetNotebooksStatsQuery } from '$lib/graphql/_gen/typed-document-nodes';
import { GetNotebooksStatsDocument } from '$lib/graphql/_gen/typed-document-nodes';
import type { PageLoad } from '@sveltejs/kit';
import type { OperationStore } from '@urql/svelte';
import { operationStore, query } from '@urql/svelte';
import LoaderIndicator from '$lib/ui/utils/LoaderIndicator.svelte';
import { startOfMonth } from 'date-fns';

const today = new Date();
const startOfTime = new Date(0);
const startOfThisMonth = startOfMonth(today);

export const load: PageLoad = async () => {
	const thisMonth = operationStore(GetNotebooksStatsDocument, {
		afterDate: { _gt: startOfThisMonth.toISOString() },
	});
	const beginning = operationStore(GetNotebooksStatsDocument, {
		afterDate: { _gt: startOfTime.toISOString() },
	});

	return {
		thisMonth,
		beginning,
	};
};
