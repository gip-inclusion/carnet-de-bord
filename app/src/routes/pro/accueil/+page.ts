import { goto } from '$app/navigation';
import { ProBeneficiaryCard, ProBeneficiarySearchBar } from '$lib/ui';
import { GetLastVisitedOrUpdatedDocument } from '$lib/graphql/_gen/typed-document-nodes';
import type { GetLastVisitedOrUpdatedQueryStore } from '$lib/graphql/_gen/typed-document-nodes';
import type { PageLoad } from '@sveltejs/kit';
import { operationStore, query } from '@urql/svelte';

export const load: PageLoad = async ({ session }) => {
	const { id } = session.user;
	/* @TODO this request does not error in Hasura when called with a professional that's null; instead it matches on all, which is obviously not what we want */
	const result = operationStore(GetLastVisitedOrUpdatedDocument, { accountId: id });

	return {
		result,
	};
};
