import Account from '$database/Account';
import type Beneficiary from '$database/Beneficiary';
import type Professional from '$database/Professional';
import { JWT_SECRET_KEY } from '$lib/variables';
import jwt from 'jsonwebtoken';

export async function post(request) {
	const { accessKey } = request.body;

	const account = await Account.query().findOne({ access_key: accessKey });

	if (!account) {
		return {
			status: 401,
			body: {
				errors: `no account for key ${accessKey}`
			}
		};
	}

	const { civilStatus, contact } = (await account.$relatedQuery<Professional | Beneficiary>(
		account.type
	)) as unknown as Professional | Beneficiary;

	const user = {
		lastname: civilStatus.lastname,
		firstname: civilStatus.firstname,
		email: contact.email,
		type: account.type
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
		.where({ username: account.username });

	return {
		headers: {
			'set-cookie': `jwt=${token}; Path=/; HttpOnly`
		},
		body: JSON.stringify({
			user
		})
	};
}
