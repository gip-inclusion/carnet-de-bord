/// <reference types="@sveltejs/kit" />

export type IAddress = {
	postalCode: string;
	city: string;
	address1: string;
	address2: string;
};

export interface IAccount {
	email: string;
	type: string;
	lastLogin: Date;
	accessKey: string;
	accessKeyDate: Date;
	beneficiary: IBeneficiary;
	professional: IProfessional;
}

export interface IBeneficiary extends IAddress {
	id: string;
	cafNumber: string;
	peNumber: string;
	mobileNumber: string;
	lastname: string;
	firstname: string;
}

export interface IProfessional {
	id: string;
	lastname: string;
	firstname: string;
	structure: Structure;
}

export interface IStructure extends IAddress {
	id: string;
	name: string;
}

export interface ImportMetaEnv {
	VITE_JWT_SECRET_KEY: string;
}
