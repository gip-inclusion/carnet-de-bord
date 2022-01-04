import {
	cityOrNameValidation,
	validateCodePostal,
	validateDateInput,
	validatePhoneNumber,
} from '$lib/validation';
import * as yup from 'yup';

export const beneficiaryAccountSchema = yup.object().shape({
	firstname: cityOrNameValidation.trim().required(),
	lastname: cityOrNameValidation.trim().required(),

	dateOfBirth: yup
		.string()
		.trim()
		.test('is-date-valid', 'Le format de la date est incorrect', validateDateInput)
		.required(),

	mobileNumber: yup
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
		.nullable()
		.test('is-cp-valid', 'Le code postal doit être composé de cinq chiffres', (value) => {
			if (value) {
				return validateCodePostal(value);
			}
			return true;
		}),
	city: cityOrNameValidation.trim().nullable(),

	peNumber: yup.string().trim().nullable(),
	cafNumber: yup.string().trim().nullable(),
});

export type BeneficiaryAccountInput = yup.InferType<typeof beneficiaryAccountSchema>;
