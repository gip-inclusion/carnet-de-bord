import BeneficiaryBusiness from '$business/BeneficiaryBusiness';
import { JWT_SECRET_KEY } from '$lib/variables';
import jwt from 'jsonwebtoken';

export async function post(request) {
	const { email } = request.body;
	const beneficiary = await BeneficiaryBusiness.findOneByEmail(email);

	if (!beneficiary) {
		return {
			status: 401,
			body: {
				errors: 'USER_NOT_FOUND'
			}
		};
	}

	const { civilStatus, contact } = beneficiary;

	const user = {
		lastname: civilStatus.lastname,
		firstname: civilStatus.firstname,
		email: contact.email,
		type: 'part'
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

	return {
		headers: {
			'set-cookie': `jwt=${token}; Path=/; HttpOnly`
		},
		body: {
			user
		}
	};
}
