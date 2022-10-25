import { writable } from 'svelte/store';
import type { Writable } from 'svelte/store';
import type { GetAccountByPkQuery } from '$lib/graphql/_gen/typed-document-nodes';

export type AccountData = GetAccountByPkQuery['account_by_pk'];
export const accountData: Writable<null | AccountData> = writable(null);
