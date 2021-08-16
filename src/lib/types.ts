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

export interface InputItem {
	hint: string;
	label: string;
	key: string;
}

export type RequestStep = 'start' | 'success' | 'error';
