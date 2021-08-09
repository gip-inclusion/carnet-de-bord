import type { Beneficiary } from '$lib/_gen/typed-document-nodes';

const notNullish = (data) => !!data;

export const displayFullName = ({ firstname, lastname }: Beneficiary): string =>
	[firstname, lastname].filter(notNullish).join(' ');

export const displayMobileNumber = ({ mobileNumber }: Beneficiary): string => mobileNumber;

export const displayFullAddress = ({ address1, address2, postalCode, city }: Beneficiary): string =>
	[[address1, address2].filter(notNullish).join(', '), [postalCode, city].join(' - ')].join(' - ');
