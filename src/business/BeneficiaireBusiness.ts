import Beneficiaire from '$database/Beneficiaire';
import type { IBeneficiaire } from 'src/global';

class BeneficiaireBusiness {
	findAll: () => Promise<IBeneficiaire[]> = async () => {
		const beneficiaires: IBeneficiaire[] = await Beneficiaire.query();
		return beneficiaires;
	};
}

export default new BeneficiaireBusiness();
