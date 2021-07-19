import Account from '$database/Account';
import { JWT_SECRET_KEY } from '$lib/variables';
import type { RequestHandler } from '@sveltejs/kit';
import jwt from 'jsonwebtoken';

export const post: RequestHandler = async (request) => {
	const { accessKey } = request.body as unknown as {
		accessKey: string;
	};

	const account = await Account.query().findOne({ access_key: accessKey });

	if (!account) {
		return {
			status: 401,
			body: {
				errors: `no account for key ${accessKey}`
			}
		};
	}

	const { email, type, lastname, firstname } = account;

	const user = {
		lastname,
		firstname,
		email,
		type
	};

	const expireIn = 24 * 60 * 60;
	const token = jwt.sign(
		{
			user
		},
		JWT_SECRET_KEY,
		{
			expiresIn: expireIn
		}
	);

	await Account.query()
		.update({ accessKey: null, accessKeyDate: null, lastLogin: new Date() })
		.where({ email: account.email });

	return {
		headers: {
			'set-cookie': `jwt=${token}; Path=/; HttpOnly`
		},
		body: JSON.stringify({
			user
		})
	};
};
