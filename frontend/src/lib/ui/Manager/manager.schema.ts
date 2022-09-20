import { cityOrNameValidation } from '$lib/validation';
import * as yup from 'yup';

export const managerAccountSchema = yup.object().shape({
	firstname: cityOrNameValidation.trim().required(),
	lastname: cityOrNameValidation.trim().required(),
	email: yup.string().trim().email().required(),
});

export type ManagerAccountInput = yup.InferType<typeof managerAccountSchema>;
