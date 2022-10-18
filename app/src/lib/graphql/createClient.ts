/* eslint-disable @typescript-eslint/no-explicit-any */
import { createClient } from '@urql/svelte';

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export default (api_url: string, token?: string, fetch) => {
	const graphqlAPI = api_url;
	return createClient({
		url: graphqlAPI,
		fetch,
		fetchOptions: () => {
			if (token) {
				return {
					headers: {
						Accept: 'application/json; version=1.0',
						'Content-Type': 'application/json',
						authorization: token ? `Bearer ${token}` : '',
					},
				};
			}
			return {
				headers: {
					Accept: 'application/json; version=1.0',
					'Content-Type': 'application/json',
					'X-Hasura-Role': 'anonymous',
				},
			};
		},
	});
};
