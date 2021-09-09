export type Account = AccountRequest & {
	onboardingDone: boolean;
	confirmed: boolean;
};

export interface AccountRequest {
	firstname?: string;
	lastname?: string;
	mobileNumber?: string;
	email?: string;
	position?: string;
	username?: string;
}

export type Structure = StructureRequest & Record<string, never>;

export type StructureRequest = {
	name?: string;
	phone?: string;
	email?: string;
	address1?: string;
	address2?: string;
	postalCode?: string;
	city?: string;
	website?: string;
	siret?: string;
	shortDesc?: string;
};

export interface InputItem {
	hint: string;
	label: string;
	key: string;
	type?: InputType;
}

export interface LabelValue {
	label: string;
	value: string;
}

export type InputType = 'email' | 'text' | 'password' | 'number';

export type RequestStep = 'start' | 'success' | 'error';

export type ExternalUser = {
	firstname: string;
	lastname: string;
	dateOfBirth: string;
	mobileOrPhoneNumber?: string;
	address1: string;
	address2: string;
	postalCode: string;
	city: string;
	email?: string;
	cafNumber?: string;
	peNumber?: string;
};

export type BeneficiaryAccount = {
	firstname?: string;
	lastname?: string;
	dateOfBirth?: string;
	mobileNumber?: string;
	email?: string;
	address1?: string;
	address2?: string;
	postalCode?: string;
	city?: string;
	cerObjects?: string[];
	rights?: string[];
	workSituations?: string[];
};
