import { json as json$1 } from '@sveltejs/kit';
import { createJwt } from '$lib/utils/getJwt';
import type { RequestHandler } from '@sveltejs/kit';

import { createClient } from '@urql/svelte';
import {
	GetAccountInfoDocument,
	ResetAccountAccessKeyDocument,
} from '$lib/graphql/_gen/typed-document-nodes';
import type { GetAccountInfoQuery } from '$lib/graphql/_gen/typed-document-nodes';
import { getGraphqlAPI, getHasuraAdminSecret } from '$lib/config/variables/private';
import * as yup from 'yup';

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

const jwtSchema = yup.object().shape({
	accessKey: yup.string().uuid().required(),
});
type Jwt = yup.InferType<typeof jwtSchema>;

const validateBody = (body: unknown): body is Jwt => {
	return jwtSchema.isType(body);
};

export const POST: RequestHandler = async ({ request }) => {
	const body = await request.json();

	if (!validateBody(body)) {
		return json$1(
			{
				errors: 'INVALID_BODY',
			},
			{
				status: 400,
			}
		);
	}

	const { accessKey } = body;

	const { data, error } = await client
		.query<GetAccountInfoQuery>(GetAccountInfoDocument, { accessKey })
		.toPromise();

	if (error || !data || data.account.length === 0) {
		if (error) {
			console.error(error);
		}
		return json$1(
			{
				errors: `no account for key ${accessKey}`,
			},
			{
				status: 401,
			}
		);
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
	} = data.account[0];
	let deploymentId = null;
	if (professional) {
		deploymentId = professional.structure.deploymentId;
	} else if (manager) {
		deploymentId = manager.deploymentId;
	} else if (adminStructure) {
		deploymentId = adminStructure.deploymentId;
	} else if (orientationManager) {
		deploymentId = orientationManager.deploymentId;
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

	return json$1(
		{
			jwt: token,
		},
		{
			headers: {
				'Cache-Control': 'private',
				'set-cookie': `jwt=${token}; Path=/; HttpOnly; Secure; SameSite=Strict`,
			},
		}
	);
};
