import * as yup from 'yup';
import { cityOrNameValidation } from '$lib/validation';

export const adminDeploymentSchema = yup.object().shape({
	email: yup.string().trim().email().required(),
	deployment: yup.string().trim().required(),
	departmentCode: yup.string().trim().required(),
});

export const deploymentAdminPdiSchema = yup.object().shape({
	firstname: cityOrNameValidation.trim().required(),
	lastname: cityOrNameValidation.trim().required(),
	email: yup.string().trim().email().required(),
});

export type AdminDeploymentType = yup.InferType<typeof adminDeploymentSchema>;

export type DeploymentAdminPdiType = yup.InferType<typeof deploymentAdminPdiSchema>;
