import * as yup from 'yup';
import { isAfter, isDate, parseISO } from 'date-fns';
import { transformDate } from '../ProNotebookContract/ProNotebookContract.schema';

export const proNotebookSocioproSchema = yup.object().shape({
	workSituation: yup.string().nullable(),
	rightRsa: yup.string().nullable(),
	rightAre: yup.boolean(),
	rightAss: yup.boolean(),
	rightRqth: yup.boolean(),
	rightBonus: yup.boolean(),
	geographicalArea: yup.string().nullable(),
	educationLevel: yup.string().nullable(),
	workSituationDate: yup.date().transform(transformDate).nullable(),
	workSituationEndDate: yup
		.mixed()
		.when('workSituationDate', {
			is: (date) => Boolean(date),
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
