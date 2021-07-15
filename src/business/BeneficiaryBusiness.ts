import { ref } from 'objection';
import Beneficiary from '$database/Beneficiary';
import type { IBeneficiary } from 'src/global';

class BeneficiaryBusiness {
	findOneByEmail = async (email: string) => {
		const beneficiary: IBeneficiary = await Beneficiary.query().findOne(
			ref('contact:email').castText(),
			'=',
			email
		);
		return beneficiary;
	};
	findAll: () => Promise<IBeneficiary[]> = async () => {
		const beneficiaries: IBeneficiary[] = await Beneficiary.query();
		return beneficiaries;
	};
}

export default new BeneficiaryBusiness();
