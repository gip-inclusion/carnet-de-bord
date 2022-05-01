export interface Appointment {
	id: string;
	professionalId?: string;
	date?: string;
	status?: string;
	isEdited?: boolean;
	isDisabled?: boolean;
	dirty?: boolean;
}
