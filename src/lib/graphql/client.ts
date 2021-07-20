import type { Client, ClientOptions } from '@urql/svelte';
import {
	createClient as _createClient,
	dedupExchange,
	errorExchange,
	cacheExchange,
	fetchExchange
} from '@urql/svelte';

export type { Client };

export async function createClient({
	dev,
	...options
}: ClientOptions & { dev: boolean }): Promise<Client> {
	const exchanges = [
		dedupExchange,
		dev &&
			errorExchange({
				onError(error, operation) {
					console.error('GraphQL error:', { error, operation });
				}
			}),
		cacheExchange,
		fetchExchange
	];

	if (dev) {
		const { devtoolsExchange } = await import('@urql/devtools');
		exchanges.unshift(devtoolsExchange);
	}

	return _createClient({ ...options, exchanges: exchanges.filter(Boolean) });
}
