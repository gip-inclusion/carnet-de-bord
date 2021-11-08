export type MarneInput = {
	address1: string;
	address2: string;
	cafNumber: string;
	city: string;
	dateOfBirth: string;
	email: string | null;
	firstname: string;
	lastname: string;
	mobileNumber: string;
	peNumber: string | null;
	postalCode: string;
	educationLevel: string | null;
	rightRsa: string;
	contracts: MarneContract[];
	axeDeTravails: MarneFocus[];
};

export type MarneContract = {
	contractSignDate: string;
	contractType: string;
};

export type MarneFocus = {
	linkedTo?: string;
	theme: string;
	objectifs: MarneTarget[];
};

export type MarneTarget = {
	objectif: string;
	actions: MarneAction[];
};

export type MarneAction = {
	action: string;
	dateStart: string;
	dateEnd: string;
	status: string;
	structure: MarneStructure;
};

export type MarneStructure = {
	address1: string;
	address2: string | null;
	city: string;
	email: string | null;
	name: string;
	phone: string | null;
	postalCode: string;
	shortDesc: string | null;
	siret: number | null;
	website: string | null;
};
