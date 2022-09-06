import type { GetNotebookAppointmentsQuery } from '$lib/graphql/_gen/typed-document-nodes';

type Appointment = GetNotebookAppointmentsQuery['getNotebookAppointments'][0];
export type AppointmentUI = {
	hours: string;
	minutes: string;
	fullDate: string;
	isEdited?: boolean;
	isDisabled?: boolean;
	dirty?: boolean;
} & Appointment;
