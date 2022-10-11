import { GetAccountByPkQuery, RoleEnum } from '$lib/graphql/_gen/typed-document-nodes';
import { GetAccountByPkDocument } from '$lib/graphql/_gen/typed-document-nodes';
import type { LayoutLoad } from '@sveltejs/kit';
import { getCrispWebsiteId } from '$lib/config/variables/public';
import Crisp from '$lib/chat/Crisp.svelte';
const CRISP_WEBSITE_ID = getCrispWebsiteId();

export const load: LayoutLoad = async ({ session }) => {
	const accountId = session.user.id;
	const result = operationStore(GetAccountByPkDocument, { accountId });

	return {
		result,
	};
};
