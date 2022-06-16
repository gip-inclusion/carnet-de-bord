import { writable } from 'svelte/store';
import type { Writable } from 'svelte/store';

export type ConnectedUser =
	| ConnectedPro
	| ConnectedAdminStructure
	| ConnectedManager
	| ConnectedBeneficiary
	| ConnectedAdmin
	| ConnectedOrientationManager;

type BaseConnectedUser = {
	id: string;
	accountId: string;
	onboardingDone: boolean;
	confirmed: boolean;
	username: string;
	firstname: string;
	lastname: string;
};

export type ConnectedPro = BaseConnectedUser & {
	type: 'pro';
	email: string;
	position: string;
	mobileNumber: string;
};

export type ConnectedAdminStructure = BaseConnectedUser & {
	type: 'adminStructure';
	email: string;
	phoneNumbers: string;
};

export type ConnectedOrientationManager = BaseConnectedUser & {
	type: 'orientationManager';
	email: string;
	phoneNumbers: string;
};

export type ConnectedManager = BaseConnectedUser & {
	type: 'manager';
	email: string;
};

export type ConnectedBeneficiary = BaseConnectedUser & {
	type: 'beneficiary';
	email: string;
	mobileNumber: string;
};

export type ConnectedAdmin = BaseConnectedUser & {
	type: 'adminCdb';
	email: string;
};

export const account: Writable<null | ConnectedUser> = writable(null);
