import { writable } from 'svelte/store';
import type { Writable } from 'svelte/store';
import type { RoleEnum } from '$lib/graphql/_gen/typed-document-nodes';

export type ConnectedUser =
	| ConnectedPro
	| ConnectedAdminStructure
	| ConnectedManager
	| ConnectedBeneficiary
	| ConnectedAdmin
	| ConnectedOrientationManager;

type BaseConnectedUser = {
	id: string;
	type: RoleEnum;
	accountId: string;
	onboardingDone: boolean;
	confirmed: boolean;
	username: string;
	firstname: string;
	lastname: string;
};

export type ConnectedPro = BaseConnectedUser & {
	type: RoleEnum.Professional;
	email: string;
	position: string;
	mobileNumber: string;
};

export type ConnectedAdminStructure = BaseConnectedUser & {
	type: RoleEnum.AdminStructure;
	email: string;
	phoneNumbers: string;
};

export type ConnectedOrientationManager = BaseConnectedUser & {
	type: RoleEnum.OrientationManager;
	email: string;
	phoneNumbers: string;
};

export type ConnectedManager = BaseConnectedUser & {
	type: RoleEnum.Manager;
	email: string;
};

export type ConnectedBeneficiary = BaseConnectedUser & {
	type: RoleEnum.Beneficiary;
	email: string;
	mobileNumber: string;
};

export type ConnectedAdmin = BaseConnectedUser & {
	type: RoleEnum.AdminCdb;
	email: string;
};

export const account: Writable<null | ConnectedUser> = writable(null);
