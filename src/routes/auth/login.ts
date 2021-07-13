import jwt from 'jsonwebtoken';
import BeneficiaireBusiness from '$business/BeneficiaireBusiness';
import { JWT_SECRET_KEY } from '$lib/variables';

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

	const expireIn = 24 * 60 * 60;
	const token = jwt.sign(
		{
			user: {
				nom: beneficiaire.nom,
				prenom: beneficiaire.prenom,
				email: beneficiaire.email
			}
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
			user: beneficiaire
		}
	};
}
