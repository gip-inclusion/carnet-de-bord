export const notNullish = (data: unknown): boolean => !!data;

export const displayFullName = ({
	firstname = '',
	lastname = '',
}: {
	firstname?: string;
	lastname?: string;
} = {}): string => [firstname, lastname].filter((field) => notNullish(field)).join(' ');

export const displayMobileNumber = ({ mobileNumber }: { mobileNumber?: string }): string | null => {
	if (!mobileNumber) {
		return null;
	}
	const phoneNumbers = mobileNumber.split(',');
	return phoneNumbers.map((phoneNumber) => formatMobileNumber(phoneNumber)).join(', ');
};

const formatMobileNumber = (mobileNumber: string): string => {
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
	[
		[address1, address2].filter((field) => notNullish(field)).join(', '),
		[postalCode, city].join(' - '),
	].join(' - ');

export function displayBoolean(value: unknown): string | null {
	if (typeof value === 'boolean') {
		return value ? 'Oui' : 'Non';
	}
	return null;
}