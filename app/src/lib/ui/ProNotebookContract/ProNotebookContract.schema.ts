import { contractTypeFullKeys } from '$lib/constants/keys';
import { isAfter, isDate, parseISO } from 'date-fns';
import * as yup from 'yup';

export function transformDate(_, originalValue) {
	if (!originalValue) return null;
	return isDate(originalValue) ? originalValue : parseISO(originalValue);
}

export const proNotebookContractSchema = yup.object().shape({
	contractType: yup
		.string()
		.nullable()
		.oneOf(contractTypeFullKeys.keys, 'Ce choix est obligatoire')
		.trim()
		.required(),
	contractSignDate: yup.mixed().when('contractType', {
		is: (val) => val !== 'no',
		then: yup.date().nullable().required().transform(transformDate),
	}),
	contractStartDate: yup.mixed().when('contractType', {
		is: (val) => val !== 'no',
		then: yup.date().nullable().required().transform(transformDate),
	}),
	contractEndDate: yup
		.mixed()
		.when('contractStartDate', {
			is: (date) => Boolean(date),
			then: yup
				.date()
				.transform(transformDate)
				.nullable()
				.test('is-after', 'La date de fin est antérieure à celle du début', (value, ctx) => {
					if (isDate(parseISO(ctx.parent.contractSignDate)) && isDate(value)) {
						return isAfter(value, new Date(ctx.parent.contractStartDate));
					}
					return true;
				}),
		})
		.nullable(),
});

export type ProNotebookContractInput = yup.InferType<typeof proNotebookContractSchema>;
