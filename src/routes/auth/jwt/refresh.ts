import { createJwt } from '$lib/utils/getJwt';
import type { RequestHandler } from '@sveltejs/kit';

import { createClient } from '@urql/svelte';
import { getGraphqlAPI } from '$lib/config/variables/public';
import {
	GetAccountInfoByRefreshTokenDocument,
	ResetAccountAccessKeyDocument,
} from '$lib/graphql/_gen/typed-document-nodes';
import type { GetAccountInfoByRefreshTokenQuery } from '$lib/graphql/_gen/typed-document-nodes';
import { getHasuraAdminSecret } from '$lib/config/variables/private';
import * as yup from 'yup';
import { v4 } from 'uuid';

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
	refreshToken: yup.string().uuid().required(),
});
type Jwt = yup.InferType<typeof jwtSchema>;

const validateBody = (body: unknown): body is Jwt => {
	return jwtSchema.isType(body);
};

export const post: RequestHandler<Record<string, unknown>, Record<string, unknown>> = async (
	request
) => {
	const body = request.body;
	if (!validateBody(body)) {
		return {
			status: 400,
			body: {
				errors: 'INVALID_BODY',
			},
		};
	}

	const { refreshToken } = body;

	const { data, error } = await client
		.query<GetAccountInfoByRefreshTokenQuery>(GetAccountInfoByRefreshTokenDocument, {
			refreshToken,
		})
		.toPromise();

	if (error || !data || data.account.length === 0) {
		if (error) {
			console.error(error);
		}
		return {
			status: 401,
			body: {
				errors: `no account for refreshToken ${refreshToken}`,
			},
		};
	}
	const {
		id,
		type,
		username,
		beneficiaryId,
		managerId,
		professionalId,
		adminStructureId,
		professional,
		manager,
		admin_structure: adminStructure,
	} = data.account[0];
	let deploymentId = null;
	if (professional) {
		deploymentId = professional.structure.deploymentId;
	} else if (manager) {
		deploymentId = manager.deploymentId;
	} else if (adminStructure) {
		deploymentId = adminStructure.deploymentId;
	}

	const newRefreshToken = v4();
	const token = createJwt({
		id,
		type,
		username,
		professionalId,
		managerId,
		beneficiaryId,
		deploymentId,
		adminStructureId,
		refreshToken: newRefreshToken,
	});

	await client
		.mutation(ResetAccountAccessKeyDocument, {
			id,
			now: new Date().toISOString(),
			refreshToken: newRefreshToken,
		})
		.toPromise();

	return {
		headers: {
			'Cache-Control': 'private',
			'set-cookie': `jwt=${token}; Path=/; HttpOnly; Secure; SameSite=Strict`,
		},
		body: {
			jwt: token,
		},
		status: 200,
	};
};
