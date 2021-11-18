import { getAppUrl, getHasuraAdminSecret } from '$lib/config/variables/private';
import { getGraphqlAPI } from '$lib/config/variables/public';
import { contactEmail } from '$lib/constants';
import {
	GetAccountByEmailDocument,
	GetAccountByEmailQuery,
	GetAccountByUsernameDocument,
	GetAccountByUsernameQuery,
	InsertProfessionalAccountDocument,
} from '$lib/graphql/_gen/typed-document-nodes';
import type { AccountRequest } from '$lib/types';
import { emailAccountRequest } from '$lib/utils/emailAccountRequest';
import { sendEmail } from '$lib/utils/sendEmail';
import type { RequestHandler } from '@sveltejs/kit';
import { createClient } from '@urql/core';

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
	const { accountRequest, structureId, requester, noEmail } = request.body as unknown as {
		accountRequest: AccountRequest;
		structureId: string;
		requester?: string;
		noEmail?: boolean;
	};

	const { email, firstname, lastname, mobileNumber, position } = accountRequest;
	let [username] = email.split('@');

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

	if (emailResult.error || !emailResult.data) {
		console.error(emailResult);
		return {
			status: 500,
			body: {
				errors: 'SERVER_ERROR',
			},
		};
	}

	if (emailResult.data.account.length > 0) {
		console.error(`l'email ${email} est déjà utilisé`);
		return {
			status: 400,
			body: {
				errors: { email: 'Cet email est déjà utilisé.' },
			},
		};
	}

	const { error, data } = await client
		.query<GetAccountByUsernameQuery>(GetAccountByUsernameDocument, {
			comp: { _like: `${username.toLowerCase()}%` },
		})
		.toPromise();

	if (error || !data) {
		console.error(error);
		return {
			status: 500,
			body: {
				errors: 'SERVER_ERROR',
			},
		};
	}

	if (data.account.length > 0) {
		const matcher = new RegExp(`^${username}(\\d*)$`);
		const index = data.account.reduce((maxIndex, item) => {
			const matched = item.username.match(matcher);
			if (!matched) {
				return maxIndex;
			}
			if (isNaN(parseInt(matched[1]))) {
				return maxIndex;
			}
			return Math.max(parseInt(matched[1]), maxIndex);
		}, 0);
		username += `${index + 1}`;
	}

	const insertResult = await client
		.mutation(InsertProfessionalAccountDocument, {
			account: {
				username: username.toLowerCase(),
				type: 'professional',
				professional: {
					data: {
						email: email.toLowerCase(),
						firstname,
						lastname,
						mobileNumber,
						position,
						structureId,
					},
				},
			},
		})
		.toPromise();

	if (insertResult.error || !insertResult.data) {
		console.error(insertResult);
		return {
			status: 500,
			body: {
				errors: 'INSERTION_ERROR',
			},
		};
	}

	const { account } = insertResult.data;
	const appUrl = getAppUrl();

	if (!noEmail) {
		// send email to first admin
		try {
			await sendEmail({
				to: contactEmail,
				subject: 'Demande de création de compte',
				html: emailAccountRequest({
					firstname,
					lastname,
					appUrl,
					requester,
				}),
			});
		} catch (e) {
			console.log(e);
		}
	}

	return {
		status: 200,
		body: { professionalId: account.professional.id },
	};
};
