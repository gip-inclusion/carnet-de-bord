import { validateCodePostal, validateDateInput, validatePhoneNumber } from '$lib/validation';
import * as yup from 'yup';

export const beneficiaryAccountSchema = yup.object().shape({
	firstname: yup.string().required(),
	lastname: yup.string().required(),
	dateOfBirth: yup
		.string()
		.test('is-date-valid', 'Le format de la date est incorrect', (value) => {
			return validateDateInput(value);
		})
		.required(),

	mobileNumber: yup
		.string()
		.test('is-phone-valid', 'Le format du téléphone est incorrect', (value) => {
			if (value) {
				return validatePhoneNumber(value);
			}
			return true;
		})
		.nullable(),
	email: yup.string().email().nullable(),
	address1: yup.string().nullable(),
	address2: yup.string().nullable(),
	postalCode: yup
		.string()
		.nullable()
		.test('is-cp-valid', 'Le code postal doit être composé de cinq chiffres', (value) => {
			if (value) {
				return validateCodePostal(value);
			}
			return true;
		}),
	city: yup.string().nullable(),
	peNumber: yup.string().nullable(),
	cafNumber: yup.string().nullable(),
});

export type BeneficiaryAccountInput = yup.InferType<typeof beneficiaryAccountSchema>;
