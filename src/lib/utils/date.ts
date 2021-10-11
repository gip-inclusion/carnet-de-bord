import { format, intlFormat } from 'date-fns';
import fr from 'date-fns/locale/fr/index.js';

export function formatDate(value: string): string {
	if (!value) {
		return null;
	}
	return format(new Date(value), 'dd MMMM yyyy', {
		locale: fr,
	});
}

export function formatDateLocale(value: string, dateFormat?: Intl.DateTimeFormatOptions): string {
	const date = new Date(value);
	if (date.toString() === 'Invalid Date') {
		return value;
	}
	return date.toLocaleDateString('fr-FR', dateFormat);
}

export function formatDateTimeLocale(value: string): string {
	const date = new Date(value);
	if (date.toString() === 'Invalid Date') {
		return value;
	}
	return intlFormat(
		date,
		{
			year: 'numeric',
			month: 'numeric',
			day: 'numeric',
			hour: 'numeric',
			minute: 'numeric',
			second: 'numeric',
			hour12: false,
			timeZone: 'Europe/Paris',
		},
		{ locale: 'fr-FR' }
	);
}
