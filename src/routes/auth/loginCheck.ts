import { getAppUrl } from '$lib/config/variables/private';
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
import { updateAccessKey } from '$lib/services/account';
import send from '$lib/emailing';
import * as yup from 'yup';
import type { EndpointOutput } from '@sveltejs/kit';
import { adminClient } from '$lib/graphql/createClient';
import type { Client, CombinedError } from '@urql/core';

let client: Client;

const loginSchema = yup
	.object()
	.shape({
		username: yup.string().required(),
	})
	.strict();
export type Login = yup.InferType<typeof loginSchema>;
export type Data = { accessUrl?: string };
export type Error = { error: string };

export async function getBeneficiaryForEmail(email: string) {
	return client
		.query<GetBeneficiaryByEmailQuery>(GetBeneficiaryByEmailDocument, {
			email,
		})
		.toPromise()
		.then(({ data, error }) => ({ data, error }));
}

export function getFirstBeneficiary({ data }) {
	return (data?.beneficiary ?? [])[0];
}

export async function createBeneficiaryAccount(
	beneficiary: GetBeneficiaryByEmailQuery['beneficiary'][0],
	username: string
) {
	const { id, firstname, lastname } = beneficiary;
	console.info(`beneficiary found with email ${username}`);
	return client
		.mutation(CreateBeneficiaryAccountDocument, {
			username: `${firstname}.${lastname}.${crypto.randomBytes(6).toString('hex')}`,
			beneficiaryId: id,
		})
		.toPromise()
		.then(({ data, error }) => ({ data, error }));
}

export async function getAccountByEmail(email: string) {
	return client
		.query<GetAccountByEmailQuery>(GetAccountByEmailDocument, {
			criteria: {
				_or: [
					{ beneficiary: { email: { _eq: email } } },
					{ professional: { email: { _eq: email } } },
					{ manager: { email: { _eq: email } } },
					{ admin: { email: { _eq: email } } },
					{ admin_structure: { email: { _eq: email } } },
				],
			},
		})
		.toPromise()
		.then(({ data, error }) => ({ data, error }));
}

export async function getAccountByUsername(username: string) {
	return client
		.query<GetAccountByUsernameQuery>(GetAccountByUsernameDocument, { comp: { _eq: username } })
		.toPromise()
		.then(({ data, error }) => ({ data, error }));
}

export function getFirstAccount(result: { data: GetAccountByEmailQuery; error: CombinedError }) {
	return (result.data?.account ?? [])[0];
}

function return400() {
	return {
		status: 400,
		body: {
			error: 'INVALID_BODY',
		},
	};
}

function return500() {
	return {
		status: 500,
		body: {
			error: 'SERVER_ERROR',
		},
	};
}

function return200(body: Record<string, string> = {}) {
	return {
		status: 200,
		body,
	};
}

export function sendNotification({ user, accessKey, id, username }) {
	const { firstname, lastname, email } = user;

	const appUrl = getAppUrl();

	// send email
	send({
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
	}).catch((emailError) => {
		console.error('Failed sending login email', { emailError, id, username, email });
	});
}

/**
 * Process
 * - try to find an account by email
 * - try to find an account by username (deprecated)
 */
export const post = async (request: Request): Promise<EndpointOutput<Data | Error>> => {
	const body = request.body;
	if (!loginSchema.isValidSync(body)) {
		return return400();
	}

	client = adminClient();

	const { username } = body;

	const beneficiaryWithoutAccountResult = await getBeneficiaryForEmail(username);

	if (beneficiaryWithoutAccountResult.error) {
		return return500();
	}

	const beneficiaryWithoutAccount = getFirstBeneficiary(beneficiaryWithoutAccountResult);

	if (beneficiaryWithoutAccount) {
		const createBeneficiaryAccountResult = await createBeneficiaryAccount(
			beneficiaryWithoutAccount,
			username
		);
		if (createBeneficiaryAccountResult.error) {
			console.error(
				`account creation for beneficiary ${username} (${beneficiaryWithoutAccount.id}) failed`
			);
			return return500();
		}
	}

	let account: GetAccountByEmailQuery['account'][0];

	const accountByEmail = await getAccountByEmail(username);
	account = getFirstAccount(accountByEmail);

	if (!account) {
		// if we fail to find an account for the given email address,
		// we try searching by the now-deprecated username
		const accountByUsername = await getAccountByUsername(username);
		account = getFirstAccount(accountByUsername);

		if (!account) {
			// it went fine but we still found no user, time to give up
			console.info('Could not find email or username', { username });
			return return200();
		}
	}

	if (!account.confirmed) {
		// OK, you do have an account, but it's not confirmed/enabled yet, so no dice!
		console.info('Refused log-in for unconfirmed account', { username });
		return return200();
	}

	const { id, beneficiary, manager, admin, professional, admin_structure } = account;
	const user = beneficiary || manager || admin || professional || admin_structure;

	const result = await updateAccessKey(client, id);

	if (result.error) {
		console.error('Could not update access key when logging in', {
			error: result.error,
			id,
			username,
		});
		return return500();
	}
	const accessKey = result.data.account.accessKey;
	sendNotification({ user, accessKey, id, username });

	return return200({
		...{ accessUrl: process.env['SANDBOX_LOGIN'] ? `/auth/jwt/${accessKey}` : null },
	});
};
