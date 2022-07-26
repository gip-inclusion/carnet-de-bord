import { cityOrNameValidation, validateCodePostal, validatePhoneNumber } from '$lib/validation';
import * as yup from 'yup';

export const structureSchema = yup.object().shape({
	siret: yup
		.string()
		.trim()
		.test('is-siret-valid', 'Le siret est incorrect', (value) => {
			if (value) {
				return validatePhoneNumber(value);
			}
			return true;
		})
		.nullable(),
	name: yup.string().trim().required(),
	shortDesc: yup.string().trim().nullable(),
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
	postalCode: yup
		.string()
		.trim()
		.nullable()
		.test('is-cp-valid', 'Le code postal doit être composé de cinq chiffres', (value) => {
			if (value) {
				return validateCodePostal(value);
			}
			return true;
		})
		.nullable(),
	city: cityOrNameValidation.trim().nullable(),
	address1: yup.string().trim().nullable(),
	address2: yup.string().trim().nullable(),
	website: yup.string().trim().nullable(),
});

export type StructureFormInput = yup.InferType<typeof structureSchema>;
