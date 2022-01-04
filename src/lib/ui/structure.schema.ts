import {
	cityOrNameValidation,
	validateCodePostal,
	validateLuhn,
	validatePhoneNumber,
} from '$lib/validation';
import * as yup from 'yup';

export const structureInputSchema = yup.object().shape({
	name: yup.string().trim().required('Ce champs est requis'),
	phone: yup
		.string()
		.trim()
		.test('is-phone-valid', 'Le format du téléphone est incorrect', (value) => {
			if (value) {
				return validatePhoneNumber(value);
			}
			return true;
		})
		.nullable(),
	email: yup.string().trim().email().nullable(),
	address1: yup.string().trim().nullable(),
	address2: yup.string().trim().nullable(),
	postalCode: yup
		.string()
		.trim()
		.test('is-cp-valid', 'Le code postal doit être composé de cinq chiffres', (value) => {
			if (value) {
				return validateCodePostal(value);
			}
			return true;
		})
		.nullable(),
	city: cityOrNameValidation.trim().nullable(),

	website: yup
		.string()
		.trim()
		.test('is-website-valid', 'L’adresse du site n’est pas valide', (value) => {
			if (value) {
				return value.startsWith('https://') || value.startsWith('http://');
			}
			return true;
		})
		.nullable(),
	siret: yup
		.string()
		.trim()
		.test('is-siret-valid', 'Le format du siret n’est pas valide', (value) => {
			if (value) {
				const cleaned = value.replace(/([^\d]|\s)/g, '');
				if (cleaned.length !== 14) {
					return false;
				}
				return validateLuhn(cleaned);
			}
			return true;
		})
		.nullable(),
	shortDesc: yup.string().trim().nullable(),
});
export type StructureInput = yup.InferType<typeof structureInputSchema>;
