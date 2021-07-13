import Beneficiaire from '$database/Beneficiaire';
import type { IBeneficiaire } from 'src/global';

class BeneficiaireBusiness {
	findOneByEmail = async (email: string) => {
		const beneficiaire: IBeneficiaire = await Beneficiaire.query().findOne({ email });
		return beneficiaire;
	};
	findAll: () => Promise<IBeneficiaire[]> = async () => {
		const beneficiaires: IBeneficiaire[] = await Beneficiaire.query();
		return beneficiaires;
	};
}

export default new BeneficiaireBusiness();
