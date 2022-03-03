/* eslint-disable @typescript-eslint/no-explicit-any */
import {
	createClient,
	dedupExchange,
	cacheExchange,
	fetchExchange,
	errorExchange,
} from '@urql/svelte';
import { getGraphqlAPI } from '$lib/config/variables/public';
import { openComponent } from '$lib/stores';
import * as Matomo from '$lib/tracking/matomo';

function getToken(session: { token?: string }) {
	return session.token;
}

function closeLayer() {
	openComponent.close();
}

async function logout() {
	Matomo.logout();
	window.location.href = '/auth/logout';
	closeLayer();
}

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export default (session: any) => {
	const graphqlAPI = session.graphqlAPI ? session.graphqlAPI : getGraphqlAPI();
	return createClient({
		url: graphqlAPI,
		exchanges: [
			dedupExchange,
			cacheExchange,
			errorExchange({
				onError: (error) => {
					const isAuthError = error.graphQLErrors.some((e) => e.extensions?.code === 'invalid-jwt');
					if (isAuthError) {
						logout();
					}
				},
			}),
			fetchExchange,
		],
		fetch,
		fetchOptions: () => {
			const token = getToken(session);
			if (token) {
				return {
					headers: { authorization: token ? `Bearer ${token}` : '' },
				};
			}
			return {
				headers: { 'X-Hasura-Role': 'anonymous' },
			};
		},
	});
};
