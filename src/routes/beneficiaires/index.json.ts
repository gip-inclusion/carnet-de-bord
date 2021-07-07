import Beneficiaire from '../../database/Beneficiaire';

export async function get() {
	const beneficiaires: Array<Beneficiaire> = await Beneficiaire.query();

	return {
		body: JSON.stringify(beneficiaires)
	};
}
