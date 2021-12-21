import { validatePhoneNumber } from '$lib/validation';
import * as yup from 'yup';

export const proAccountSchema = yup.object().shape({
	firstname: yup.string().required(),
	lastname: yup.string().required(),
	email: yup.string().email().required(),
	mobileNumber: yup
		.string()
		.test('is-phone-valid', 'Le format du téléphone est incorrect', (value) => {
			if (value) {
				return validatePhoneNumber(value);
			}
			return true;
		})
		.nullable(),
	position: yup.string().nullable(),
});

export const proAccountSchemaWithStructure = proAccountSchema.shape({
	structureId: yup.string().uuid().required(),
});

export type ProAccountInput = yup.InferType<typeof proAccountSchema>;
export type ProAccountWithStructureInput = yup.InferType<typeof proAccountSchemaWithStructure>;
