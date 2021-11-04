import { sendEmail } from '$lib/utils/sendEmail';
import { emailLoginRequest } from '$lib/utils/emailLoginRequest';
import type { RequestHandler } from '@sveltejs/kit';
import { v4 as uuidv4 } from 'uuid';
import { getAppUrl, getHasuraAdminSecret } from '$lib/config/variables/private';
import createClient from '$lib/graphql/createClient';
import { getGraphqlAPI } from '$lib/config/variables/public';
import {
	GetAccountByEmailDocument,
	GetAccountByEmailQuery,
	GetAccountByUsernameDocument,
	GetAccountByUsernameQuery,
	UpdateAccountAccessKeyDocument,
} from '$lib/graphql/_gen/typed-document-nodes';

const client = createClient({ url: getGraphqlAPI() });
client.requestPolicy = 'network-only';
client.fetch = fetch;
client.fetchOptions = {
	headers: {
		'Content-Type': 'application/json',
		'x-hasura-admin-secret': getHasuraAdminSecret(),
	},
};

export const post: RequestHandler = async (request) => {
	const { username } = request.body as unknown as {
		username: string;
	};

	let account;

	const usernameResult = await client
		.query<GetAccountByUsernameQuery>(GetAccountByUsernameDocument, { login: username })
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
			.query<GetAccountByEmailQuery>(GetAccountByEmailDocument, { login: username })
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

	const accessKey = uuidv4();

	await client
		.mutation(UpdateAccountAccessKeyDocument, {
			id,
			accessKey: accessKey,
			accessKeyDate: new Date(),
		})
		.toPromise();

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
