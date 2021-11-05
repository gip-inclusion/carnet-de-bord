import { sendEmail } from '$lib/utils/sendEmail';
import { emailLoginRequest } from '$lib/utils/emailLoginRequest';
import type { RequestHandler } from '@sveltejs/kit';
import { getAppUrl, getHasuraAdminSecret } from '$lib/config/variables/private';

import { getGraphqlAPI } from '$lib/config/variables/public';
import {
	GetAccountByEmailDocument,
	GetAccountByEmailQuery,
	GetAccountByUsernameDocument,
	GetAccountByUsernameQuery,
} from '$lib/graphql/_gen/typed-document-nodes';
import { createClient } from '@urql/core';
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
	const { username } = request.body as unknown as {
		username: string;
	};

	let account;

	const usernameResult = await client
		.query<GetAccountByUsernameQuery>(GetAccountByUsernameDocument, { comp: { _eq: username } })
		.toPromise();

	if (usernameResult.error) {
		return {
			status: 401,
			body: {
				errors: 'USER_NOT_FOUND',
			},
		};
	}
	if (!usernameResult.data || usernameResult.data.account.length === 0) {
		const emailResult = await client
			.query<GetAccountByEmailQuery>(GetAccountByEmailDocument, {
				criteria: {
					_or: [
						{ beneficiary: { email: { _eq: username } } },
						{ professional: { email: { _eq: username } } },
						{ manager: { email: { _eq: username } } },
						{ admin: { email: { _eq: username } } },
					],
				},
			})
			.toPromise();
		if (emailResult.error || !usernameResult.data || usernameResult.data.account.length === 0) {
			return {
				status: 401,
				body: {
					errors: 'USER_NOT_FOUND',
				},
			};
		}
		account = emailResult.data.account[0];
	} else {
		account = usernameResult.data.account[0];
	}
	if (!account.confirmed) {
		return {
			status: 403,
			body: {
				errors: 'ACCOUNT_NOT_CONFIRMED',
			},
		};
	}
	const { id, beneficiary, manager, admin, professional } = account;
	const user = beneficiary || manager || admin || professional;

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
	const { firstname, lastname, email } = user;

	const appUrl = getAppUrl();

	// send email
	try {
		await sendEmail({
			to: email,
			subject: 'Accédez à Carnet de bord',
			html: emailLoginRequest({ firstname, lastname, accessKey, appUrl }),
		});
	} catch (e) {
		console.log(e);
	}

	return {
		status: 200,
		body: {
			email,
			...{ accessUrl: process.env['SANDBOX_LOGIN'] ? `/auth/jwt/${accessKey}` : null },
		},
	};
};
