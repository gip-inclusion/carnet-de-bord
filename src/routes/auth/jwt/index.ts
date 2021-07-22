import knex from '$lib/config/db/knex';
import { getJwtUser } from '$lib/utils/getJwt';
import type { RequestHandler } from '@sveltejs/kit';

export const post: RequestHandler = async (request) => {
	const { accessKey } = request.body as unknown as {
		accessKey: string;
	};

	const account = (await knex('account').where({ access_key: accessKey }).first()) as {
		id: string;
		type: string;
		username: string;
	};

	if (!account) {
		return {
			status: 401,
			body: {
				errors: `no account for key ${accessKey}`
			}
		};
	}

	const user = getJwtUser(account);

	await await knex('account')
		.update({ access_key: null, access_key_date: null, last_login: new Date() })
		.where({ username: account.username });

	return {
		headers: {
			'set-cookie': `jwt=${user.token}; Path=/; HttpOnly`
		},
		body: {},
		status: 200
	};
};
