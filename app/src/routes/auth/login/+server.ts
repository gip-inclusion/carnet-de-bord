import {
	getAppUrl,
	getGraphqlAPI,
	getHasuraAdminSecret,
	getSandboxLogin,
} from '$lib/config/variables/private';
import crypto from 'crypto';

import {
	CreateBeneficiaryAccountDocument,
	GetAccountByEmailDocument,
	GetAccountByUsernameDocument,
	GetBeneficiaryByEmailDocument,
} from '$lib/graphql/_gen/typed-document-nodes';
import type {
	GetAccountByEmailQuery,
	GetAccountByUsernameQuery,
	GetBeneficiaryByEmailQuery,
} from '$lib/graphql/_gen/typed-document-nodes';
import { createClient } from '@urql/core';
import { updateAccessKey } from '$lib/services/account';
import send from '$lib/emailing';
import * as yup from 'yup';
import { error, json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { logger } from '$lib/utils/logger';

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
	username: yup.string().lowercase().trim().required(),
});
type Login = yup.InferType<typeof loginSchema>;

const validateBody = (body: unknown): body is Login => {
	return loginSchema.isType(body);
};

/**
 * Process
 * - try to find an account by email
 * - try to find an account by username (deprecated)
 */

export const POST: RequestHandler = async ({ request }) => {
	const body = await request.json();
	if (!validateBody(body)) {
		throw error(400, 'INVALID_BODY');
	}

	const { username } = body;

	try {
		await createBeneficiaryIfNotExist(username);
	} catch (err) {
		logger.error(err);
		throw error(500, 'SERVER_ERROR');
	}

	const emailResult = await client
		.query<GetAccountByEmailQuery>(GetAccountByEmailDocument, {
			criteria: {
				_and: [
					{ deletedAt: { _is_null: true } },
					{
						_or: [
							{ beneficiary: { email: { _eq: username } } },
							{ professional: { email: { _eq: username } } },
							{ manager: { email: { _eq: username } } },
							{ admin: { email: { _eq: username } } },
							{ admin_structure: { email: { _eq: username } } },
							{ orientation_manager: { email: { _eq: username } } },
						],
					},
				],
			},
		})
		.toPromise();
	let account: (typeof emailResult.data.account)[0];

	if (emailResult.error) {
		logger.error(emailResult.error);
		throw error(500, 'SERVER_ERROR');
	}

	if (emailResult.data.account.length === 0) {
		// if we fail to find an account for the given email address,
		// we try searching by the now-deprecated username
		const usernameResult = await client
			.query<GetAccountByUsernameQuery>(GetAccountByUsernameDocument, { comp: { _eq: username } })
			.toPromise();

		if (usernameResult.error) {
			// something went wrong but we're not saying what at the moment
			logger.info({ username }, 'Could not find account with username', usernameResult.error);
			throw error(500, 'SERVER_ERROR');
		}

		if (!usernameResult.data || usernameResult.data.account.length === 0) {
			// it went fine but we still found no user, time to give up
			logger.info({ username }, 'Could not find username');
			throw error(401, 'ACCOUNT_NOT_FOUND');
		}

		// otherwise, we have a winner
		account = usernameResult.data.account[0];
	} else {
		// we did get an answer,let's use it!
		// in case we have multiple account with same email
		// here is the order admin_structure, orientation_manager, manager, professional
		account = emailResult.data.account[0];
	}

	if (!account.confirmed) {
		// OK, you do have an account, but it's not confirmed/enabled yet, so no dice!
		logger.error(`Refused log-in for unconfirmed account ${username}`, error);
		throw error(403, 'ACCOUNT_NOT_CONFIRMED');
	}

	const { id, beneficiary, manager, admin, professional, admin_structure, orientation_manager } =
		account;
	const user =
		beneficiary || manager || admin || professional || admin_structure || orientation_manager;

	const result = await updateAccessKey(client, id);

	if (result.error) {
		logger.error(`Could not update access key for username ${username} id:${id}`, result.error);
		throw error(500, 'SERVER_ERROR');
	}

	const accessKey = result.data.account.accessKey;
	const { firstname, lastname, email } = user;

	const appUrl = getAppUrl();

	// send email
	send({
		options: {
			to: email,
			subject: 'Accédez à Carnet de bord',
		},
		template: 'LoginRequest',
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
	}).catch((emailError) => {
		logger.error({ emailError, id, username, email }, 'Failed sending login email');
	});

	return json({
		email,
		...{ accessUrl: getSandboxLogin() ? `/auth/jwt/${accessKey}` : null },
	});
};

async function createBeneficiaryIfNotExist(username: string) {
	const existingBeneficiaryResponse = await client
		.query<GetBeneficiaryByEmailQuery>(GetBeneficiaryByEmailDocument, {
			email: username,
		})
		.toPromise();

	if (existingBeneficiaryResponse.error) {
		console.error(
			`GetBeneficiaryByEmailDocument error for ${username}`,
			existingBeneficiaryResponse.error
		);
		throw error(500, 'SERVER_ERROR');
	}

	if (existingBeneficiaryResponse.data.beneficiary.length === 0) {
		// We don't need to create an account since the email
		// does not belong to a beneficiary
		return;
	}

	const [{ id, firstname, lastname }] = existingBeneficiaryResponse.data.beneficiary;
	logger.debug(`beneficiary found with email ${username}`);

	const createBeneficiaryAccountResponse = await client
		.mutation(CreateBeneficiaryAccountDocument, {
			username: `${firstname}.${lastname}.${crypto.randomBytes(6).toString('hex')}`,
			beneficiaryId: id,
		})
		.toPromise();

	if (createBeneficiaryAccountResponse.error) {
		logger.error(
			`CreateBeneficiaryAccountDocument error for beneficiary ${id}`,
			createBeneficiaryAccountResponse.error
		);
		throw error(500, 'SERVER_ERROR');
	}
	return createBeneficiaryAccountResponse.data;
}
