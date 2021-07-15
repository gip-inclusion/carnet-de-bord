import BeneficiaryBusiness from '$business/BeneficiaryBusiness';

export async function get(): Promise<{ body: string }> {
	const beneficiaries = await BeneficiaryBusiness.findAll();

	return {
		body: JSON.stringify(beneficiaries)
	};
}
