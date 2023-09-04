import {
	cityOrNameValidation,
	nullifyEmptyString,
	validateCodePostal,
	validateLuhn,
	validatePhoneNumber,
} from '$lib/validation';
import * as yup from 'yup';

export const structureSchema = yup.object().shape({
	siret: yup
		.string()
		.trim()
		.test('is-siret-valid', 'Le siret est incorrect', (value) => {
			if (value) {
				return validateLuhn(value);
			}
			return true;
		})
		.transform(nullifyEmptyString)
		.nullable(),
	name: yup.string().trim().required(),
	sensitive: yup.boolean(),
	shortDesc: yup.string().trim().nullable(),
	phone: yup
		.string()
		.trim()
		.test('is-phone-valid', 'Le format est incorrect', (value) => {
			if (value) {
				return value
					.split(',')
					.flatMap((value) => (value ? value.trim() : []))
					.every(validatePhoneNumber);
			}
			return true;
		})
		.transform(nullifyEmptyString)
		.nullable(),
	email: yup.string().trim().email().transform(nullifyEmptyString).nullable(true),
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
	address2: yup.string().trim().nullable().transform(nullifyEmptyString),
	website: yup.string().trim().transform(nullifyEmptyString).nullable(),
});

export type StructureFormInput = yup.InferType<typeof structureSchema>;
