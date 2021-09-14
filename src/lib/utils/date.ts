import { format } from 'date-fns';
import fr from 'date-fns/locale/fr/index.js';

export function formatDate(value: string): string {
	if (!value) {
		return null;
	}
	return format(new Date(value), 'dd MMMM yyyy', {
		locale: fr
	});
}

export function formatDateLocale(value: string, format?: Intl.DateTimeFormatOptions): string {
	const date = new Date(value);
	if (date.toString() === 'Invalid Date') {
		return value;
	}
	return date.toLocaleDateString('fr-FR', format);
}
