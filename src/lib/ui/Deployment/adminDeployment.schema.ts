import * as yup from 'yup';

export const adminDeploymentSchema = yup.object().shape({
	email: yup.string().trim().email().required(),
	deployment: yup.string().trim().required(),
});

export type AdminDeploymentType = yup.InferType<typeof adminDeploymentSchema>;
