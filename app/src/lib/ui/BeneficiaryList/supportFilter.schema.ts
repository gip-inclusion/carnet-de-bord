import * as yup from 'yup';
export const supportFilterSchema = yup.object().shape({
	filter: yup.string().nullable(),
	search: yup.string().nullable(),
});

export type SupportFilterValues = yup.InferType<typeof supportFilterSchema>;
