/* eslint-disable @typescript-eslint/no-explicit-any */
import { createClient } from '@urql/svelte';
import { getGraphqlAPI } from '$lib/config/variables/public';

function getToken(session: { token?: string }) {
	return session.token;
}

export const userClient = (authorizationHeader: string) => {
	return client({
		authorization: authorizationHeader,
	});
};

export const client = (headers: Record<string, string>) =>
	createClient({
		fetch,
		fetchOptions: {
			headers: {
				'Content-Type': 'application/json',
				...headers,
			},
		},
		requestPolicy: 'network-only',
		url: getGraphqlAPI(),
	});

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export default (session: any) => {
	const graphqlAPI = session.graphqlAPI ? session.graphqlAPI : getGraphqlAPI();
	return createClient({
		url: graphqlAPI,
		fetch,
		fetchOptions: () => {
			const token = getToken(session);
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
