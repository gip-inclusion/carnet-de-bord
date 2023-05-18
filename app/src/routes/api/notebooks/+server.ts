import { getBackendAPI, getRdvISecret } from '$lib/config/variables/private';
import { error } from '@sveltejs/kit';
import * as yup from 'yup';

import type { RequestHandler } from './$types';
import { createGraphqlAdminClient } from '$lib/graphql/createAdminClient';
import {
	GetAccountByEmailDocument,
	RoleEnum,
	type GetAccountByEmailQuery,
} from '$lib/graphql/_gen/typed-document-nodes';
import { logger } from '$lib/utils/logger';
import { createJwt } from '$lib/utils/getJwt';

const bodySchema = yup.object().shape({
	rdviUserEmail: yup.string().required(),
	deploymentId: yup.string().uuid().required(),
});
type BodyType = yup.InferType<typeof bodySchema>;

const client = createGraphqlAdminClient();

export const POST = (async ({ request }) => {
	const authorization = request.headers.get('authorization');

	if (!authorization) {
		throw error(401, { message: 'missing authorization' });
	}

	if (authorization.substring('Bearer '.length) !== getRdvISecret()) {
		throw error(403, { message: 'wrong authorization' });
	}

	let body: BodyType;
	try {
		body = await request.json();
	} catch (bodyParsingError) {
		// do nothing the validate function will throw a more accurate error
	}

	try {
		await bodySchema.validate(body);
	} catch (validationError) {
		throw error(422, { message: `${validationError.message}` });
	}

	const accountResult = await client
		.query<GetAccountByEmailQuery>(GetAccountByEmailDocument, {
			criteria: {
				_and: [
					{ deletedAt: { _is_null: true } },
					{ manager: { email: { _eq: body.rdviUserEmail } } },
				],
			},
		})
		.toPromise();

	if (accountResult.error) {
		logger.error(accountResult.error);
		throw error(500, { message: 'Internal server error' });
	}

	if (accountResult.data.account.length === 0) {
		logger.error(`manager account ${body.rdviUserEmail} not found`);
		throw error(400, { message: 'manager account not found' });
	}

	const accountId = accountResult.data.account[0].id;

	const jwt = createJwt({
		id: accountId,
		type: RoleEnum.Manager,
		deploymentId: body.deploymentId,
	});

	const url = getBackendAPI();
	return fetch(`${url}/v1/notebooks`, {
		method: 'POST',
		body: JSON.stringify(body),
		headers: {
			Accept: 'application/json; version=1.0',
			authorization: `Bearer ${jwt}`,

			// Prevent the fetch implementation (undici most likely) from requesting
			// compressed data from the upstream server. Because the same fetch implementation
			// automatically uncompresses the received data, it would make work for this proxy
			// and require us to scrub the 'Content-Encoding' header from the response before
			// forwarding it.
			// The Scalingo router will compress our responses for the client if necessary in
			// any case.
			'Accept-Encoding': 'identity',
		},
	});
}) satisfies RequestHandler;
