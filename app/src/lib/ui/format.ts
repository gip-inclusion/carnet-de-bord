import { capitalize } from '$lib/utils/string';

export const notNullish = (data: unknown): boolean => !!data;

type Person = {
	firstname?: string;
	lastname?: string;
};

export const formatNames = (person: Person): Person => {
	return {
		firstname: capitalize(person.firstname) ?? '',
		lastname: person.lastname?.toUpperCase() ?? '',
	};
};

export const displayFullName = (
	person: Person = {},
	mode: 'firstname first' | 'lastname first' = 'firstname first'
): string => {
	const formatted = formatNames(person);
	let parts = [formatted.firstname, formatted.lastname];
	if (mode === 'lastname first') parts = parts.reverse();
	return parts.join(' ').trim();
};

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
