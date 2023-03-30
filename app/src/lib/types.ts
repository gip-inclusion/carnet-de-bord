export type Account = AccountRequest & {
	id?: string;
	username: string;
	onboardingDone: boolean;
	confirmed: boolean;
};

export interface AccountRequest {
	email: string;
	firstname?: string;
	lastname?: string;
	mobileNumber?: string;
	position?: string;
}

export type RequestStep = 'start' | 'loading' | 'success' | 'error';

export type Structure = StructureRequest & { id: string };

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
	required?: boolean;
}

export interface LabelValue {
	label: string;
	value: string;
}

export interface LabelName {
	label: string;
	name: string;
}

export type InputType = 'email' | 'text' | 'password' | 'number' | 'date';

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
	workSituation?: string;
	cafNumber?: string;
	peNumber?: string;
};

type GetHtml<Data> = keyof Data | ((data: Data) => string);

export type TableHeader<Data> = {
	id: string;
	label: string;
	getHtml: GetHtml<Data>;
};

export interface Option {
	name: string;
	label: string;
	group?: string;
}

export type MenuItem = {
	id: string;
	path: string;
	label: string;
};
export type IdentifierCAF = 'CAF';
export type IdentifierPE = 'PE';
export type NoIdentifier = 'NoIdentifier';
export type IdentifierType = IdentifierCAF | IdentifierPE | NoIdentifier;

export type SvelteEventHandler<HTMLElement> = (
	event: Event & { currentTarget: EventTarget & HTMLElement }
) => void;

export type DeploymentConfig = {
	url: string;
	headers: Record<string, string>;
	callback: string;
};
