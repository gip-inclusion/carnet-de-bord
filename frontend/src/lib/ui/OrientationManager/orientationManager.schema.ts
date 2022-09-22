import { cityOrNameValidation } from '$lib/validation';
import * as yup from 'yup';

export const orientationManagerAccountSchema = yup.object().shape({
	firstname: cityOrNameValidation.trim().required(),
	lastname: cityOrNameValidation.trim().required(),
	email: yup.string().trim().email().required(),
	phoneNumbers: yup.string().trim(),
});

export type OrientationManagerAccountInput = yup.InferType<typeof orientationManagerAccountSchema>;
