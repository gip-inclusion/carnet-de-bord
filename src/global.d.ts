/// <reference types="@sveltejs/kit" />

export type Address = {
	postalCode: string;
	city: string;
	address: string;
};

export type Contact = {
	mobileNumber: string;
};

export interface IAccount {
	email: string;
	type: string;
	lastname: string;
	firstname: string;
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
	address: Address;
	contact: Contact;
}

export interface IProfessional {
	id: string;
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
