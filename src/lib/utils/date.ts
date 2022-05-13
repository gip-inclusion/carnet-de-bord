import { format, intlFormat, parse as dateParse } from 'date-fns';
import fr from 'date-fns/locale/fr/index.js';

export function formatDate(value: string): string {
	if (!value) {
		return null;
	}
	return format(new Date(value), 'd MMMM yyyy', {
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
export function formatDateISO(date: Date): string {
	const isoDate = date.toISOString();
	const [dateToken] = isoDate.split('T');
	return dateToken;
}

export function excelDateParser(excelDate: number) {
	return new Date(Date.UTC(0, 0, excelDate - 1));
}

export function parseImportedDate(date: string): string {
	let parsedDate;
	try {
		if (!isNaN(+date)) {
			parsedDate = excelDateParser(+date);
		} else {
			const dateFormats: string[] = ['dd/MM/yyyy', 'dd-MM-yyyy', 'yyyy-MM-dd'];
			dateFormats.every((formatString) => {
				parsedDate = dateParse(date, formatString, new Date());
				return parsedDate.toString() === 'Invalid Date';
			});
		}
		return format(parsedDate, 'yyyy-MM-dd');
	} catch (exception) {
		return '';
	}
}
