export type Person = {
	firstname: string;
	lastname: string;
};

export type Pro = Person;

export type Account = { username: string } & Person;

type Url = {
	appUrl: string;
	accessKey?: string;
	redirectUrl?: string;
};

export function createLink({ appUrl, accessKey, redirectUrl }: Url) {
	return `${appUrl}${accessKey ? `/auth/jwt/${accessKey}` : ''}${
		redirectUrl ? `?url=${redirectUrl}` : ''
	}`;
}

export type Templates =
	| 'notebookInvitation'
	| 'loginRequest'
	| 'forgotLoginRequest'
	| 'accountRequestValidate'
	| 'accountRequest'
	| 'accountCreatedByAdmin'
	| 'adminStructureAccountCreation'
	| 'adminStructureAddedToStructure'
	| 'managerOnboarding';
