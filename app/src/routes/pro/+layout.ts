import { goto } from '$app/navigation';
import type { GetAccountByPkQuery } from '$lib/graphql/_gen/typed-document-nodes';
import { GetAccountByPkDocument } from '$lib/graphql/_gen/typed-document-nodes';
import type { MenuItem } from '$lib/types';
import Footer from '$lib/ui/base/Footer.svelte';
import Header from '$lib/ui/base/Header.svelte';

import { LayerCDB } from '$lib/ui/index';
import LoaderIndicator from '$lib/ui/utils/LoaderIndicator.svelte';
import type { LayoutLoad } from '@sveltejs/kit';
import type { OperationStore } from '@urql/svelte';
import { operationStore, query } from '@urql/svelte';
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
