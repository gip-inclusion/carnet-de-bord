import type { RequestHandler } from '@sveltejs/kit';
import { getAppUrl, getHasuraAdminSecret } from '$lib/config/variables/private';

import { getGraphqlAPI } from '$lib/config/variables/public';
import {
	GetAccountByEmailDocument,
	GetAccountByUsernameDocument,
} from '$lib/graphql/_gen/typed-document-nodes';
import type {
	GetAccountByEmailQuery,
	GetAccountByUsernameQuery,
} from '$lib/graphql/_gen/typed-document-nodes';
import { createClient } from '@urql/core';
import { updateAccessKey } from '$lib/services/account';
import send from '$lib/emailing';
import * as yup from 'yup';

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

const loginSchema = yup.object().shape({
	username: yup.string().required(),
});
type Login = yup.InferType<typeof loginSchema>;

const validateBody = (body: unknown): body is Login => {
	return loginSchema.isType(body);
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

	const { username } = body;

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
	let account: typeof emailResult.data.account[0];

	if (emailResult.error || emailResult.data.account.length === 0) {
		// if we fail to find an account for the given email address,
		// we try searching by the now-deprecated username
		const usernameResult = await client
			.query<GetAccountByUsernameQuery>(GetAccountByUsernameDocument, { comp: { _eq: username } })
			.toPromise();

		if (usernameResult.error) {
			// something went wrong but we're not saying what at the moment
			console.info('Could not find account with email', { username });
			return {
				status: 401,
				body: {
					errors: 'USER_NOT_FOUND',
				},
			};
		}

		if (!usernameResult.data || usernameResult.data.account.length === 0) {
			// it went fine but we still found no user, time to give up
			console.info('Could not find username', { username });
			return {
				status: 401,
				body: {
					errors: 'USER_NOT_FOUND',
				},
			};
		}

		// otherwise, we have a winner
		account = usernameResult.data.account[0];
	} else {
		// we did get an answer,let's use it!
		account = emailResult.data.account[0];
	}

	if (!account.confirmed) {
		// OK, you do have an account, but it's not confirmed/enabled yet, so no dice!
		console.info('Refused log-in for unconfirmed account', { username });
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
		console.error('Could not update access key when logging in', {
			error: result.error,
			id,
			username,
		});
		return {
			status: 500,
			body: {
				errors: 'SERVER_ERROR',
			},
		};
	}
	const accessKey = result.data.account.accessKey;
	const { firstname, lastname, email } = user;

	const appUrl = getAppUrl();

	// send email
	try {
		await send({
			options: {
				to: email,
				subject: 'Accédez à Carnet de bord',
			},
			template: 'loginRequest',
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
	} catch (error) {
		console.error('Failed sending login email', { error, id, username, email });
	}

	return {
		status: 200,
		body: {
			email,
			...{ accessUrl: process.env['SANDBOX_LOGIN'] ? `/auth/jwt/${accessKey}` : null },
		},
	};
};
