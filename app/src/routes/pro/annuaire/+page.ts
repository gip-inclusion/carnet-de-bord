import { Select } from '$lib/ui/base';
import { ProBeneficiaryCard } from '$lib/ui';
import LoaderIndicator from '$lib/ui/utils/LoaderIndicator.svelte';
import type {
	NotebookMember,
	SearchNotebookMemberQueryStore,
	SearchNotebookMemberQueryVariables,
} from '$lib/graphql/_gen/typed-document-nodes';
import { SearchNotebookMemberDocument } from '$lib/graphql/_gen/typed-document-nodes';
import type { PageLoad } from '@sveltejs/kit';
import { operationStore, query } from '@urql/svelte';
import { addMonths } from 'date-fns';

const dt = {
	none: 'none',
	'3months': '3months',
	'3-6months': '3-6months',
	'6-12months': '6-12months',
	'12months': '12months',
};

function buildQueryVariables({ accountId, search, selected }) {
	const today = new Date();
	let visitDate = { _gt: undefined, _lt: undefined };

	if (selected === dt['3months']) {
		visitDate._gt = addMonths(today, -3);
	} else if (selected === dt['3-6months']) {
		visitDate._gt = addMonths(today, -6);
		visitDate._lt = addMonths(today, -3);
	} else if (selected === dt['6-12months']) {
		visitDate._gt = addMonths(today, -12);
		visitDate._lt = addMonths(today, -6);
	} else if (selected === dt['12months']) {
		visitDate._lt = addMonths(today, -12);
	}

	const variables: SearchNotebookMemberQueryVariables = { accountId, visitDate };
	variables.filter = `${search ?? ''}`;
	return variables;
}

export const load: PageLoad = async ({ url, session }) => {
	const search = url.searchParams.get('search');

	let selected = dt.none;
	if (url.searchParams.get('dt') && dt[url.searchParams.get('dt')]) {
		selected = dt[url.searchParams.get('dt')];
	}
	const { id } = session.user;
	const queryVariables = buildQueryVariables({ accountId: id, search, selected });
	const result = operationStore(SearchNotebookMemberDocument, queryVariables);

	return {
		accountId: id,
		result,
		search,
		selected,
	};
};
