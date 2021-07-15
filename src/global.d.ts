/// <reference types="@sveltejs/kit" />

export type CivilStatus = {
	civility: !string;
	lastname: !string;
	firstname: !string;
};

export type Address = {
	postalCode: string;
	city: string;
	address: string;
};

export type Contact = {
	email: string;
	mobileNumber: string;
};

export interface IAccount {
	username: string;
	type: string;
	lastLogin: Date;
	accessKey: string;
	accessKeyDate: Date;
	beneficiary: IBeneficiary;
	professional: IProfessional;
}

export interface IBeneficiary {
	id: string;
	cafNumber: string;
	peNumber: string;
	civilStatus: CivilStatus;
	address: Address;
	contact: Contact;
}

export interface IProfessional {
	id: string;
	civilStatus: CivilStatus;
	contact: Contact;
	structure: Structure;
}

export interface IStructure {
	id: string;
	name: string;
	address: Address;
}

export interface ImportMetaEnv {
	VITE_JWT_SECRET_KEY: string;
}
