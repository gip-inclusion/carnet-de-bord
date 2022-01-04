import { cityOrNameValidation } from '$lib/validation';
import * as yup from 'yup';

export const adminDeploymentSchema = yup.object().shape({
	account: yup.string().trim().required(),
	firstname: cityOrNameValidation.trim().required(),
	lastname: cityOrNameValidation.trim().required(),
	email: yup.string().trim().email().required(),
	deployment: yup.string().trim().required(),
});

export type AdminDeploymentType = yup.InferType<typeof adminDeploymentSchema>;
