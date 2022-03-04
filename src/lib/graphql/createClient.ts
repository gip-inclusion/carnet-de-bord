import { CombinedError, errorExchange, makeOperation } from '@urql/core';
import { createClient, dedupExchange, cacheExchange, fetchExchange } from '@urql/svelte';
import { authExchange } from '@urql/exchange-auth';
import { getGraphqlAPI } from '$lib/config/variables/public';
import { openComponent } from '$lib/stores';
import * as Matomo from '$lib/tracking/matomo';
import jwtDecode from 'jwt-decode';
import type { JwtPayload } from '$lib/utils/getJwt';

function closeLayer() {
	openComponent.close();
}

async function logout() {
	Matomo.logout();
	window.location.href = '/auth/logout';
	closeLayer();
}

const getAuth =
	(session) =>
	async ({ authState }) => {
		const token = session?.token;
		const refreshToken = session?.user?.refreshToken;
		if (!authState) {
			if (token && refreshToken) {
				return { token, refreshToken };
			}
			return null;
		}

		const response: Response = await fetch(`/auth/jwt/refresh`, {
			method: 'POST',
			headers: {
				Accept: 'application/json; version=1.0',
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({
				refreshToken,
			}),
		});

		if (response.ok) {
			const { jwt } = await response.json();
			const user = jwtDecode<JwtPayload>(jwt);
			session.user = user;
			session.token = jwt;
			Matomo.setCustomDimension(Matomo.CustomDimensions.Role, session.user.role);
			if (session.user.deploymentId) {
				Matomo.setCustomDimension(Matomo.CustomDimensions.Deployment, session.user.deploymentId);
			}
			// TODO set the jwt in the cookie
			return {
				token: session.token,
				refreshToken: session.user.refreshToken,
			};
		}

		logout();
		return null;
	};

const addAuthToOperation = ({ authState, operation }) => {
	if (!authState || !authState.token) {
		return operation;
	}

	const fetchOptions =
		typeof operation.context.fetchOptions === 'function'
			? operation.context.fetchOptions()
			: operation.context.fetchOptions || {};

	const token = authState.token;
	const header = token
		? { Authorization: token ? `Bearer ${token}` : '' }
		: { 'X-Hasura-Role': 'anonymous' };

	return makeOperation(operation.kind, operation, {
		...operation.context,
		fetchOptions: {
			...fetchOptions,
			headers: {
				...fetchOptions.headers,
				...header,
			},
		},
	});
};

const didAuthError = ({ error }: { error: CombinedError }): boolean => {
	return error.graphQLErrors.some((e) => e.extensions?.code === 'invalid-jwt');
};

const willAuthError = ({ authState }) => {
	if (!authState) return true;
	// e.g. check for expiration, existence of auth etc
	return false;
};

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export default (session) => {
	const graphqlAPI = session.graphqlAPI ? session.graphqlAPI : getGraphqlAPI();
	return createClient({
		url: graphqlAPI,
		exchanges: [
			dedupExchange,
			cacheExchange,
			errorExchange({
				onError: (error) => {
					// we only get an auth error here when the auth exchange had attempted to refresh auth and getting an auth error again for the second time
					const isAuthError = error.graphQLErrors.some(
						(e) => e.extensions?.code === 'validation-failed'
					);

					if (isAuthError) {
						logout();
					}
				},
			}),
			authExchange({ addAuthToOperation, getAuth: getAuth(session), didAuthError, willAuthError }),
			fetchExchange,
		],
	});
};
