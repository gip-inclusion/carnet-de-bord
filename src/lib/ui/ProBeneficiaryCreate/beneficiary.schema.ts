import { isDate } from 'date-fns';
import * as yup from 'yup';

export const beneficiaryAccountSchema = yup.object().shape({
	firstname: yup.string().required(),
	lastname: yup.string().required(),
	dateOfBirth: yup.string().test('is-date-valid', 'Le format de la date est incorrect', (value) => {
		if (!/[0-9]{4}-[0-9]{2}-[0-9]{2}/.test(value)) {
			return false;
		}
		const date = new Date(value);
		return isDate(date);
	}),

	mobileNumber: yup
		.string()
		.test('is-phone-valid', 'Le format du téléphone est incorrect', (value) => {
			return /^(?:(?:\+|00)33|0)\s*[1-9](?:[\s.-]*\d{2}){4}$/.test(value.trim());
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
				// le code postal est composé de 5 chiffres mais
				// ne peut pas commencer par 00 sinon il est pas valide
				if (value.slice(0, 2) === '00') return false;
				return /[0-9]{5}/.test(value);
			}
			return true;
		}),
	city: yup.string().nullable(),
	peNumber: yup.string().nullable(),
	cafNumber: yup.string().nullable(),
});

export type BeneficiaryAccountInput = yup.InferType<typeof beneficiaryAccountSchema>;
