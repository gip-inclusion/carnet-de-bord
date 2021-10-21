export const notNullish = (data: unknown): boolean => !!data;

export const displayFullName = ({
	firstname,
	lastname,
}: {
	firstname?: string;
	lastname?: string;
}): string => [firstname, lastname].filter(notNullish).join(' ');

export const displayMobileNumber = ({ mobileNumber }: { mobileNumber?: string }): string | null => {
	if (!mobileNumber) {
		return null;
	}
	const phoneNumber = [];
	const chunkSize = 2;
	for (let i = 0; i < mobileNumber.length; i += chunkSize) {
		phoneNumber.push(mobileNumber.slice(i, i + chunkSize));
	}
	return phoneNumber.join(' ');
};

export const displayFullAddress = ({
	address1,
	address2,
	postalCode,
	city,
}: {
	address1?: string;
	address2?: string;
	postalCode?: string;
	city?: string;
}): string =>
	[[address1, address2].filter(notNullish).join(', '), [postalCode, city].join(' - ')].join(' - ');
