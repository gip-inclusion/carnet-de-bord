import {
	cityOrNameValidation,
	nullifyEmptyString,
	validateCodePostal,
	validateDateInput,
	validatePhoneNumber,
} from '$lib/validation';
import * as yup from 'yup';

const beneficiaryAccountSchemaObject = {
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
		.transform(nullifyEmptyString)
		.nullable(),
	email: yup.string().trim().email().transform(nullifyEmptyString).nullable(),
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

	rightRsa: yup.string().nullable(),
	rightAre: yup.boolean(),
	rightAss: yup.boolean(),
	rightBonus: yup.boolean(),
};

export const beneficiaryAccountSchema = yup.object().shape({ ...beneficiaryAccountSchemaObject });
export const beneficiaryAccountPartialSchema = yup.object().shape({
	...beneficiaryAccountSchemaObject,
	firstname: beneficiaryAccountSchemaObject.firstname.optional(),
	lastname: beneficiaryAccountSchemaObject.lastname.optional(),
	dateOfBirth: beneficiaryAccountSchemaObject.dateOfBirth.optional(),
});

export type BeneficiaryAccountInput = yup.InferType<typeof beneficiaryAccountSchema>;
export type BeneficiaryAccountPartialInput = yup.InferType<typeof beneficiaryAccountPartialSchema>;
