import * as yup from 'yup';

export const adminDeploymentSchema = yup.object().shape({
	account: yup.string().required(),
	firstname: yup.string().required(),
	lastname: yup.string().required(),
	email: yup.string().email().required(),
	deployment: yup.string().required(),
});

export type AdminDeploymentType = yup.InferType<typeof adminDeploymentSchema>;
