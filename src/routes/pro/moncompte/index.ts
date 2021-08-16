import knex from '$lib/config/db/knex';
import type { RequestHandler } from '@sveltejs/kit';
import type { AccountRequest } from '$lib/types';

export const post: RequestHandler = async (request) => {
	const { account } = request.body as unknown as {
		account: AccountRequest;
	};

	/* @TODO we can do better. Hopefully. */
	const { username, email, mobileNumber, ...professional } = account;

	const acc = (await knex('account').where({ username }).first()) as unknown as {
		id: string;
		type: 'professional' | 'beneficiary' | 'admin';
		professional_id: string;
		confirmed: boolean;
	};

	if (!account) {
		return {
			status: 401,
			body: {
				errors: 'USER_NOT_FOUND'
			}
		};
	}

	if (acc.type !== 'professional') {
		return {
			status: 401,
			body: {
				errors: 'WRONG_ACCOUNT_TYPE'
			}
		};
	}

	if (!acc.confirmed) {
		return {
			status: 403,
			body: {
				errors: 'ACCOUNT_NOT_CONFIRMED'
			}
		};
	}

	const patchKnex = { mobile_number: mobileNumber, ...professional };
	const patch = { mobileNumber, ...professional };

	await knex('professional').update(patchKnex).where({ id: acc.professional_id });

	await knex('account').update({ onboarding_done: true }).where({ username });

	return {
		status: 200,
		body: { patch }
	};
};
