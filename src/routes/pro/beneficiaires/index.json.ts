import BeneficiaireBusiness from '$business/BeneficiaireBusiness';

export async function get() {
	const beneficiaires = await BeneficiaireBusiness.findAll();

	return {
		body: JSON.stringify(beneficiaires)
	};
}
