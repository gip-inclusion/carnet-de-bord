import type { RequestHandler } from '@sveltejs/kit';
import { getAppUrl, getHasuraAdminSecret } from '$lib/config/variables/private';
import { createClient } from '@urql/core';
import { getGraphqlAPI } from '$lib/config/variables/public';
import {
	GetAccountByEmailDocument,
	GetAccountByEmailQuery,
} from '$lib/graphql/_gen/typed-document-nodes';
import { updateAccessKey } from '$lib/services/account';
import send from '$lib/emailing';

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
	const { email } = request.body as unknown as {
		email: string;
	};

	const { error, data } = await client
		.query<GetAccountByEmailQuery>(GetAccountByEmailDocument, {
			criteria: {
				_or: [
					{ beneficiary: { email: { _eq: email } } },
					{ professional: { email: { _eq: email } } },
					{ manager: { email: { _eq: email } } },
					{ admin: { email: { _eq: email } } },
				],
			},
		})
		.toPromise();

	if (error || !data || data.account.length === 0) {
		return {
			status: 401,
			body: {
				errors: 'ACCOUNT_NOT_FOUND',
			},
		};
	}
	const { id, username, beneficiary, manager, admin, professional } = data.account[0];
	const user = beneficiary || manager || admin || professional;
	const { firstname, lastname } = user;
	const result = await updateAccessKey(client, id);
	if (result.error) {
		console.error('login', result.error);
		return {
			status: 500,
			body: {
				errors: 'SERVER_ERRROR',
			},
		};
	}
	const accessKey = result.data.account.accessKey;

	const appUrl = getAppUrl();

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
						username,
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
		body: {
			email,
		},
	};
};
