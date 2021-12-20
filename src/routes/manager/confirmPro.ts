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
	const { id } = request.body as unknown as {
		id: string;
	};

	const appUrl = getAppUrl();

	const { error, data } = await client
		.query<GetAccountByIdQuery>(GetAccountByIdDocument, { id })
		.toPromise();

	if (error) {
		console.error('confirmPro', error);
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

	// send email
	try {
		await send({
			options: {
				to: email,
				subject: "Votre demande d'inscription à Carnet de Bord est validée",
			},
			template: 'accountRequestValidate',
			params: [
				{
					pro: {
						firstname,
						lastname,
					},
					url: {
						accessKey,
						appUrl,
					},
				},
			],
		});
	} catch (e) {
		console.log(e);
	}

	return {
		status: 200,
		body: {},
	};
};
