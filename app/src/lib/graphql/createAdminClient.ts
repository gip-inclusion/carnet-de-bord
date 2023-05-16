import { getGraphqlAPI, getHasuraAdminSecret } from '$lib/config/variables/private';
import { createClient } from '@urql/core';
export function createGraphqlAdminClient() {
	return createClient({
		fetch,
		fetchOptions: {
			headers: {
				'Content-Type': 'application/json',
				'x-hasura-admin-secret': getHasuraAdminSecret(),
			},
		},
		requestPolicy: 'network-only',
		url: getGraphqlAPI(),
	});
}
