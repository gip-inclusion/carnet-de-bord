import { browser } from '$app/environment';
import createClient from '$lib/graphql/createClient';
import {
	GetAccountByPkDocument,
	type GetAccountByPkQuery,
} from '$lib/graphql/_gen/typed-document-nodes';
import { accountData } from '$lib/stores';
import { error } from '@sveltejs/kit';

import type { Client } from '@urql/core';
import type { LayoutLoad } from './$types';

export const load: LayoutLoad = async (event) => {
	const data = await event.parent();
	const client: Client = createClient(event.fetch);
	const accountInfo = await getAccount(client, data.user.id);
	if (!accountInfo) {
		throw error(400, 'récupération du compte impossible');
	}
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
		console.error(
			{
				err: result.error,
				browser,
			},
			`Récupération du compte utilisateur ${accountId} impossible`
		);
	}
	if (result.data) {
		return result.data.account_by_pk;
	}
	return null;
}
