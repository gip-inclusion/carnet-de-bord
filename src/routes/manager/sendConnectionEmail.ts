import type { RequestHandler } from '@sveltejs/kit';
import send from '$lib/emailing';
import { getAppUrl, getHasuraAdminSecret } from '$lib/config/variables/private';
import { createClient } from '@urql/core';
import { getGraphqlAPI } from '$lib/config/variables/public';
import {
	GetAccountByIdDocument,
	GetAccountByIdQuery,
} from '$lib/graphql/_gen/typed-document-nodes';
import { updateAccessKey } from '$lib/services/account';
import { authorizeOnly } from '$lib/utils/security';

const client = createClient({
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

export const post: RequestHandler = async (request) => {
	try {
		authorizeOnly(['manager'])(request);
	} catch (e) {
		return {
			status: 403,
		};
	}

	const { id } = request.body as unknown as {
		id: string;
	};

	const appUrl = getAppUrl();

	const { error, data } = await client
		.query<GetAccountByIdQuery>(GetAccountByIdDocument, { id })
		.toPromise();

	if (error) {
		console.error('sendConnectionEmail', error);
		return {
			status: 500,
			body: {
				errors: 'SERVER_ERROR',
			},
		};
	}

	if (!data.account) {
		return {
			status: 404,
			body: {
				errors: 'Account not found',
			},
		};
	}

	if (!data.account.professional) {
		return {
			status: 404,
			body: {
				errors: 'Professional not found',
			},
		};
	}

	const { email, lastname, firstname } = data.account.professional;

	const result = await updateAccessKey(client, id);
	if (result.error) {
		console.error('login', result.error);
		return {
			status: 500,
			body: {
				errors: 'SERVER_ERROR',
			},
		};
	}
	const accessKey = result.data.account.accessKey;
	const username = data.account.username;

	// send email
	try {
		await send({
			options: {
				to: email,
				subject: 'Accédez à votre espace Carnet de bord',
			},
			template: 'forgotLoginRequest',
			params: [
				{
					account: {
						firstname,
						lastname,
						username,
					},
					url: {
						accessKey,
						appUrl,
					},
				},
			],
		});
	} catch (e) {
		return {
			status: 500,
			body: {
				errors: 'SERVER_ERROR',
			},
		};
	}

	return {
		status: 200,
		body: {},
	};
};
