import { ref } from 'objection';
import Professional from '$database/Professional';
import type { IProfessional } from 'src/global';

class ProfessionalBusiness {
	findOneByEmail = async (email: string) => {
		const professional: IProfessional = await Professional.query().findOne(
			ref('contact:email').castText(),
			'=',
			email
		);
		return professional;
	};
}

export default new ProfessionalBusiness();
