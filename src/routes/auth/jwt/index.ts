import Account from '$database/Account';
import type { RequestHandler } from '@sveltejs/kit';

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

	const user = await account.getUser();

	await Account.query()
		.update({ accessKey: null, accessKeyDate: null, lastLogin: new Date() })
		.where({ username: account.username });

	return {
		headers: {
			'set-cookie': `jwt=${user.token}; Path=/; HttpOnly`
		},
		body: { user }
	};
};
