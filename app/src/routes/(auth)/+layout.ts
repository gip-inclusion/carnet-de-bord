import createClient from '$lib/graphql/createClient';
import {
	GetAccountByPkDocument,
	type GetAccountByPkQuery,
} from '$lib/graphql/_gen/typed-document-nodes';
import { accountData } from '$lib/stores';

import type { Client } from '@urql/core';
import type { LayoutLoad } from './$types';

export const load: LayoutLoad = async (event) => {
	const data = await event.parent();
	const client: Client = createClient(event.fetch, data.graphqlAPI, data.token);

	const accountInfo = await getAccount(client, data.user.id);
	accountData.set(accountInfo);
	return {
		account: accountInfo,
	};
};

async function getAccount(
	client: Client,
	accountId: string
): Promise<GetAccountByPkQuery['account_by_pk'] | null> {
	const result = await client.query(GetAccountByPkDocument, { accountId }).toPromise();
	if (result.error) {
		console.error(`Récuparation du compte utilisateur ${accountId} impossible`);
	}
	if (result.data) {
		return result.data.account_by_pk;
	}
	return null;
}
