import { cityOrNameValidation, validatePhoneNumber } from '$lib/validation';
import * as yup from 'yup';

export const adminStructureAccountSchema = yup.object().shape({
	firstname: cityOrNameValidation.trim().required(),
	lastname: cityOrNameValidation.trim().required(),
	email: yup.string().trim().email().required(),
	phoneNumbers: yup
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
		.nullable(),
});

export type AdminStructureAccountInput = yup.InferType<typeof adminStructureAccountSchema>;
