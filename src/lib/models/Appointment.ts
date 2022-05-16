import type { GetNotebookAppointmentsQuery } from '$lib/graphql/_gen/typed-document-nodes';

type Appointment = GetNotebookAppointmentsQuery['getNotebookAppointments'][0];
export type AppointmentUI = {
	isEdited?: boolean;
	isDisabled?: boolean;
	dirty?: boolean;
} & Appointment;
