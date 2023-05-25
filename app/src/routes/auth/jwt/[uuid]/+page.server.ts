import { error, redirect } from '@sveltejs/kit';
import type { Actions, RequestEvent } from '@sveltejs/kit';
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

async function lookupAccessKey(accessKey: string): Promise<GetAccountInfoQuery['account'][0]> {
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

	return getAccountResult.data.account[0];
}

export const actions: Actions = {
	default: async ({ url, params, cookies, setHeaders }: RequestEvent) => {
		const redirectAfterLogin = url.searchParams.get('url');

		const account = await lookupAccessKey(params.uuid);

		const {
			id,
			type,
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
		} = account;
		let deploymentId = null;
		let structureId = null;
		if (professional) {
			deploymentId = professional.structure.deploymentId;
			structureId = professional.structure.id;
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
			professionalId,
			managerId,
			beneficiaryId,
			deploymentId,
			adminStructureId,
			orientationManagerId,
			structureId,
		});

		await client
			.mutation(ResetAccountAccessKeyDocument, {
				id,
			})
			.toPromise();

		cookies.set('jwt', token, {
			path: '/',
			httpOnly: true,
			sameSite: 'strict',
		});

		setHeaders({ 'Cache-Control': 'private' });

		throw redirect(303, redirectAfterLogin ?? '/');
	},
};

export const load: PageServerLoad = async ({ params }: RequestEvent) => {
	await lookupAccessKey(params.uuid);
};
