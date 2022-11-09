import { error } from '@sveltejs/kit';
import { createJwt } from '$lib/utils/getJwt';

import { createClient } from '@urql/core';
import {
	GetAccountInfoDocument,
	ResetAccountAccessKeyDocument,
} from '$lib/graphql/_gen/typed-document-nodes';
import type { GetAccountInfoQuery } from '$lib/graphql/_gen/typed-document-nodes';
import { getGraphqlAPI, getHasuraAdminSecret } from '$lib/config/variables/private';
import type { PageServerLoad } from './$types';

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

export const load: PageServerLoad = async ({ url, params, cookies, setHeaders }) => {
	const redirectAfterLogin = url.searchParams.get('url');
	const accessKey = params.uuid;

	const getAccountResult = await client
		.query<GetAccountInfoQuery>(GetAccountInfoDocument, { accessKey })
		.toPromise();

	if (
		getAccountResult.error ||
		!getAccountResult.data ||
		getAccountResult?.data.account.length === 0
	) {
		if (getAccountResult.error) {
			console.error(error);
		}
		throw error(401, `no account for key ${accessKey}`);
	}

	const {
		id,
		type,
		username,
		beneficiaryId,
		managerId,
		professionalId,
		adminStructureId,
		orientationManagerId,
		professional,
		manager,
		adminStructure,
		orientationManager,
		beneficiary,
	} = getAccountResult.data.account[0];
	let deploymentId = null;
	if (professional) {
		deploymentId = professional.structure.deploymentId;
	} else if (manager) {
		deploymentId = manager.deploymentId;
	} else if (adminStructure) {
		deploymentId = adminStructure.deploymentId;
	} else if (orientationManager) {
		deploymentId = orientationManager.deploymentId;
	} else if (beneficiary) {
		deploymentId = beneficiary.deploymentId;
	}

	const token = createJwt({
		id,
		type,
		username,
		professionalId,
		managerId,
		beneficiaryId,
		deploymentId,
		adminStructureId,
		orientationManagerId,
	});

	await client
		.mutation(ResetAccountAccessKeyDocument, { id, now: new Date().toISOString() })
		.toPromise();

	cookies.set('jwt', token, { path: '/', httpOnly: true, /* secure: true, */ sameSite: 'strict' });

	setHeaders({ 'Cache-Control': 'private' });

	return { redirectAfterLogin };
};
