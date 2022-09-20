import { cityOrNameValidation } from '$lib/validation';
import * as yup from 'yup';

export const proAccountSchema = yup.object().shape({
	firstname: cityOrNameValidation.trim().required(),
	lastname: cityOrNameValidation.trim().required(),
	email: yup.string().trim().email().required(),
	mobileNumber: yup.string().trim().nullable(),
	position: yup.string().trim().nullable(),
});

export const proAccountSchemaWithStructure = proAccountSchema.shape({
	structureId: yup.string().trim().uuid().required(),
});

export type ProAccountInput = yup.InferType<typeof proAccountSchema>;
export type ProAccountWithStructureInput = yup.InferType<typeof proAccountSchemaWithStructure>;
