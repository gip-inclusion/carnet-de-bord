import { getGraphqlAPI, getRdvISecret } from '$lib/config/variables/private';
import { error } from '@sveltejs/kit';
import * as yup from 'yup';
import { createClient } from '@urql/core';

import type { RequestHandler } from './$types';
import { createGraphqlAdminClient } from '$lib/graphql/createAdminClient';
import {
	CreateNotebookDocument,
	type CreateNotebookMutation,
	type CreateNotebookMutationVariables,
	GetAccountByEmailDocument,
	type GetAccountByEmailQuery,
	RoleEnum,
} from '$lib/graphql/_gen/typed-document-nodes';
import { logger } from '$lib/utils/logger';
import { createJwt } from '$lib/utils/getJwt';
import type { GraphQLError } from 'graphql/index';

const bodySchema = yup.object().shape({
	rdviUserEmail: yup.string().required(),
	deploymentId: yup.string().uuid().required(),
	notebook: yup.object().shape({
		nir: yup.string().required(),
		externalId: yup.string(),
		firstname: yup.string().required(),
		lastname: yup.string().required(),
		// we keep the date as a string to let
		// Hasura to be the single point of validation
		dateOfBirth: yup.string().required(),
		mobileNumber: yup.string(),
		email: yup.string(),
		address1: yup.string(),
		address2: yup.string(),
		postalCode: yup.string(),
		city: yup.string(),
		cafNumber: yup.string(),
	}),
});
type BodyType = yup.InferType<typeof bodySchema>;

const client = createGraphqlAdminClient();

type CreateResult =
	| { type: 'success'; notebookId: string }
	| { type: 'conflict'; error: GraphQLError }
	| { type: 'bad-request'; message: string };

const createNotebook = async (jwt: string, body: BodyType): Promise<CreateResult> => {
	const authorizedClient = createClient({
		fetch,
		fetchOptions: {
			headers: {
				'Content-Type': 'application/json',
				Authorization: `Bearer ${jwt}`,
			},
		},
		requestPolicy: 'network-only',
		url: getGraphqlAPI(),
	});

	// TODO:
	//	- Ajouter des tests et adapter le code pour gérer les erreurs retournées par la mutation
	const result = await authorizedClient
		.mutation<CreateNotebookMutation, CreateNotebookMutationVariables>(CreateNotebookDocument, {
			notebook: body.notebook,
		})
		.toPromise();

	if (!result.error) {
		return { type: 'success', notebookId: result.data.create_notebook.notebookId };
	}
	if (result.error.graphQLErrors) {
		const gqlError = result.error.graphQLErrors[0];
		if (gqlError.extensions.error_code === 409) {
			return { type: 'conflict', error: gqlError };
		}
	}
	return { type: 'bad-request', message: result.error.toString() };
};

const createManagerJwt = (accountId: string, deploymentId: string) =>
	createJwt({
		id: accountId,
		type: RoleEnum.Manager,
		deploymentId: deploymentId,
	});

const findAccountId = async (email: string, deploymentId: string) => {
	const accountResult = await client
		.query<GetAccountByEmailQuery>(GetAccountByEmailDocument, {
			criteria: {
				_and: [
					{ deletedAt: { _is_null: true } },
					{
						manager: {
							email: { _eq: email },
							deploymentId: { _eq: deploymentId },
						},
					},
				],
			},
		})
		.toPromise();

	if (accountResult.error) {
		logger.error(accountResult.error);
		throw error(500, { message: 'Internal server error' });
	}

	if (accountResult.data.account.length === 0) {
		logger.error(`manager account ${email} not found`);
		throw error(400, { message: 'manager account not found' });
	}

	return accountResult.data.account[0].id;
};

const checkAuthorization = (request: Request) => {
	const authorization = request.headers.get('authorization');

	if (!authorization) {
		throw error(401, { message: 'missing authorization' });
	}

	if (authorization.substring('Bearer '.length) !== getRdvISecret()) {
		throw error(403, { message: 'wrong authorization' });
	}
};

const parse = async (request: Request) => {
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
	return body;
};

export const POST = (async ({ request }) => {
	checkAuthorization(request);
	const body: BodyType = await parse(request);
	const accountId = await findAccountId(body.rdviUserEmail, body.deploymentId);
	const jwt = createManagerJwt(accountId, body.deploymentId);

	const result = await createNotebook(jwt, body);

	switch (result.type) {
		case 'success':
			return new Response(JSON.stringify({ notebookId: result.notebookId }), {
				status: 201,
			});
		case 'conflict':
			throw error(409, result.error);
		case 'bad-request':
			throw error(400, { message: result.message });
	}
}) satisfies RequestHandler;
