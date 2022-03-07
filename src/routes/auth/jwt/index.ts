import { createJwt } from '$lib/utils/getJwt';
import type { EndpointOutput, RequestHandler } from '@sveltejs/kit';

import { createClient } from '@urql/svelte';
import { getGraphqlAPI } from '$lib/config/variables/public';
import {
	GetAccountInfoDocument,
	GetAccountInfoByRefreshTokenDocument,
	ResetAccountAccessKeyDocument,
} from '$lib/graphql/_gen/typed-document-nodes';
import type {
	GetAccountInfoByRefreshTokenQuery,
	GetAccountInfoQuery,
} from '$lib/graphql/_gen/typed-document-nodes';
import { getHasuraAdminSecret } from '$lib/config/variables/private';
import * as yup from 'yup';
import { v4 } from 'uuid';
import type { DefaultBody } from '@sveltejs/kit/types/endpoint';

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

const jwtSchema = yup.object().shape(
	{
		accessKey: yup
			.string()
			.uuid()
			.when('refreshToken', {
				is: (refreshToken) => !refreshToken || refreshToken.length === 0,
				then: yup.string().uuid().required(),
				otherwise: yup.string().uuid(),
			}),
		refreshToken: yup
			.string()
			.uuid()
			.when('accessKey', {
				is: (accessKey) => !accessKey || accessKey.length === 0,
				then: yup.string().uuid().required(),
				otherwise: yup.string().uuid(),
			}),
	},
	[['accessKey', 'refreshToken']]
);
type Jwt = yup.InferType<typeof jwtSchema>;

const validateBody = (body: unknown): body is Jwt => {
	return jwtSchema.isType(body);
};

async function fail(errors) {
	return {
		status: 401,
		body: {
			errors,
		},
	};
}

async function createTokenFromAccount(
	account: GetAccountInfoQuery['account'][0] | GetAccountInfoByRefreshTokenQuery['account'][0]
): Promise<EndpointOutput<DefaultBody>> {
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
	} = account;

	let deploymentId = null;
	if (professional) {
		deploymentId = professional.structure.deploymentId;
	} else if (manager) {
		deploymentId = manager.deploymentId;
	} else if (adminStructure) {
		deploymentId = adminStructure.deploymentId;
	}

	const refreshToken = v4();
	const token = createJwt({
		id,
		type,
		username,
		professionalId,
		managerId,
		beneficiaryId,
		deploymentId,
		adminStructureId,
		refreshToken,
	});

	await client
		.mutation(ResetAccountAccessKeyDocument, {
			id,
			now: new Date().toISOString(),
			refreshToken,
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
}

async function checkAccessKey(body): Promise<EndpointOutput<DefaultBody>> {
	const { accessKey } = body;

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

	return createTokenFromAccount(data.account[0]);
}

async function checkRefreshToken(body): Promise<EndpointOutput<DefaultBody>> {
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

		return fail(`no account for refreshToken ${refreshToken}`);
	}

	const refreshTokenDate = data?.account[0]?.refreshTokenDate;

	if (!refreshTokenDate) {
		return fail(`refreshTokenDate for ${refreshToken} not found`);
	}

	const duration = 1000 * 60 * 60 * 24 * 30; // 30 days
	const offset = new Date().getTime() - new Date(refreshTokenDate).getTime();

	if (duration < offset) {
		return fail(`refreshToken ${refreshToken} expired`);
	}

	return createTokenFromAccount(data.account[0]);
}

export const post: RequestHandler<Record<string, unknown>, Record<string, unknown>> = async ({
	body,
}) => {
	if (validateBody(body)) {
		if (body.refreshToken) {
			return checkRefreshToken(body);
		}

		if (body.accessKey) {
			return checkAccessKey(body);
		}
	}

	return {
		status: 400,
		body: {
			errors: 'INVALID_BODY',
		},
	};
};
