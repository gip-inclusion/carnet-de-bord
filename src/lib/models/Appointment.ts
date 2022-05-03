export class Appointment {
	id: string;
	professionalId?: string;
	date?: string;
	status?: string;
	isEdited?: boolean;
	isDisabled?: boolean;
	dirty?: boolean;

	constructor(id = null, professionalId = null, date = null, status = null) {
		this.id = id;
		this.professionalId = professionalId;
		this.date = date;
		this.status = status;
		this.isEdited = true;
		this.isDisabled = false;
		this.dirty = false;
	}

	public cancelEdition() {
		this.isDisabled = false;
		this.isEdited = false;
	}

	public toggleEdit() {
		this.isDisabled = false;
		this.isEdited = true;
	}

	public disable() {
		this.isDisabled = true;
		this.isEdited = false;
	}
}
