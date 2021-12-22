import { getJwtUser } from '$lib/utils/getJwt';
import type { RequestHandler } from '@sveltejs/kit';

import { createClient } from '@urql/svelte';
import { getGraphqlAPI } from '$lib/config/variables/public';
import {
	GetAccountInfoDocument,
	GetAccountInfoQuery,
	ResetAccountAccessKeyDocument,
} from '$lib/graphql/_gen/typed-document-nodes';
import { getHasuraAdminSecret } from '$lib/config/variables/private';

const client = createClient({
	url: getGraphqlAPI(),
	fetch,
	fetchOptions: {
		headers: {
			'Content-Type': 'application/json',
			'x-hasura-admin-secret': getHasuraAdminSecret(),
		},
	},
	requestPolicy: 'network-only',
});

export const post: RequestHandler = async (request) => {
	const { accessKey } = request.body as unknown as {
		accessKey: string;
	};
	const { data, error } = await client
		.query<GetAccountInfoQuery>(GetAccountInfoDocument, { accessKey })
		.toPromise();

	if (error || !data || data.account.length === 0) {
		if (error) {
			console.error(error);
		}
		return {
			status: 401,
			body: {
				errors: `no account for key ${accessKey}`,
			},
		};
	}
	const { id, type, username, beneficiaryId, managerId, professionalId, professional, manager } =
		data.account[0];
	let deploymentId = null;
	if (professional) {
		deploymentId = professional.structure.deploymentId;
	} else if (manager) {
		deploymentId = manager.deploymentId;
	}

	const user = getJwtUser({
		id,
		type,
		username,
		professionalId,
		managerId,
		beneficiaryId,
		deploymentId,
	});

	await client
		.mutation(ResetAccountAccessKeyDocument, { id, now: new Date().toISOString() })
		.toPromise();

	return {
		headers: {
			'set-cookie': `jwt=${user.token}; Path=/; HttpOnly; SameSite=Strict`,
		},
		body: {
			jwt: user.token,
		},
		status: 200,
	};
};
