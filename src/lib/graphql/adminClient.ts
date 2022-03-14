/* eslint-disable @typescript-eslint/no-explicit-any */
import { client } from '$lib/graphql/createClient';
import { getHasuraAdminSecret } from '$lib/config/variables/private';

export const adminClient = () => {
	return client({
		'x-hasura-admin-secret': getHasuraAdminSecret(),
	});
};
