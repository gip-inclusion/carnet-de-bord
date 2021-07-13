import BeneficiaireBusiness from '$business/BeneficiaireBusiness';
import { JWT_SECRET_KEY } from '$lib/variables';
import jwt from 'jsonwebtoken';

export async function post(request) {
	const { email } = request.body;
	const beneficiaire = await BeneficiaireBusiness.findOneByEmail(email);

	if (!beneficiaire) {
		return {
			status: 401,
			body: {
				errors: 'USER_NOT_FOUND'
			}
		};
	}

	const user = {
		nom: beneficiaire.nom,
		prenom: beneficiaire.prenom,
		email: beneficiaire.email,
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
