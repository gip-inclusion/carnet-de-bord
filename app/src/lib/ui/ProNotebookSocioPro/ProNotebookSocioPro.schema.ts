import * as yup from 'yup';
import { isAfter, isDate, parseISO } from 'date-fns';
import { transformDate } from '../ProNotebookContract/ProNotebookContract.schema';

export const proNotebookSocioproSchema = yup.object().shape({
	workSituation: yup.string().nullable(),
	rightRqth: yup.boolean(),
	geographicalArea: yup
		.number()
		.positive()
		.integer()
		.nullable()
		.transform((_, val) => (val === '' ? null : Number(val))),
	educationLevel: yup.string().nullable(),
	lastJobEndedAt: yup.date().transform(transformDate).nullable(),
	workSituationDate: yup.date().transform(transformDate).nullable(),
	workSituationEndDate: yup
		.mixed()
		.when('workSituationDate', {
			is: (date: unknown) => Boolean(date),
			then: yup
				.date()
				.transform(transformDate)
				.nullable()
				.test('is-after', 'La date de fin est antérieure à celle du début', (value, ctx) => {
					if (isDate(parseISO(ctx.parent.workSituationDate)) && isDate(value)) {
						return isAfter(value, new Date(ctx.parent.workSituationDate));
					}
					return true;
				}),
		})
		.nullable(),
});

export type ProNotebookSocioproInput = yup.InferType<typeof proNotebookSocioproSchema>;
