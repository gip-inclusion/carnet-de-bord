const notNullish = (data) => !!data;

export const displayFullName = ({
	firstname,
	lastname
}: {
	firstname?: string;
	lastname?: string;
}): string => [firstname, lastname].filter(notNullish).join(' ');

export const displayMobileNumber = ({ mobileNumber }: { mobileNumber?: string }): string =>
	mobileNumber;

export const displayFullAddress = ({
	address1,
	address2,
	postalCode,
	city
}: {
	address1?: string;
	address2?: string;
	postalCode?: string;
	city?: string;
}): string =>
	[[address1, address2].filter(notNullish).join(', '), [postalCode, city].join(' - ')].join(' - ');
