import { goto } from '$app/navigation';
import type { GetAccountByPkQuery } from '$lib/graphql/_gen/typed-document-nodes';
import { GetAccountByPkDocument } from '$lib/graphql/_gen/typed-document-nodes';
import type { LayoutLoad } from '@sveltejs/kit';
import type { OperationStore } from '@urql/svelte';
import { operationStore, query } from '@urql/svelte';

export const load: LayoutLoad = async ({ session }) => {
	const accountId = session.user.id;
	const result = operationStore(GetAccountByPkDocument, { accountId });

	return {
		result,
	};
};
